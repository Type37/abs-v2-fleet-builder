import { strict as assert } from "node:assert";
import { test } from "node:test";

import { readdirSync } from "node:fs";

import { deriveCommandEffects, effectiveCost } from "../src/command-effects.ts";
import type { Faction } from "../src/types.ts";

// The app discovers factions by globbing the folder (web/catalog.ts), so the
// sweep below has to read the folder too. src/index.ts exports only the four
// Armageddon factions, which would leave two thirds of the corpus untested.
async function allFactions(): Promise<Faction[]> {
  const dir = new URL("../src/data/factions/", import.meta.url);
  const out: Faction[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
    const mod = (await import(new URL(file, dir).href)) as Record<string, unknown>;
    for (const v of Object.values(mod)) {
      const f = v as Faction;
      if (f && typeof f === "object" && typeof f.name === "string" && Array.isArray(f.hvp)) out.push(f);
    }
  }
  return out;
}

test("reads a granted command out of the house wording", () => {
  const e = deriveCommandEffects([
    {
      name: "Sound Investments",
      text: "This fleet gains access to the following command: Financial Review (1 CMD): Once per round, during the Jump Phase, you may Jump In a new unit.",
    },
  ]);
  assert.equal(e.granted.length, 1);
  assert.equal(e.granted[0]?.name, "Financial Review");
  assert.equal(e.granted[0]?.cost, 1);
  assert.match(e.granted[0]?.text ?? "", /^Once per round/);
  assert.equal(e.granted[0]?.source, "Sound Investments");
});

test("reads the other grant introductions", () => {
  const shapes = [
    "This unit gains the command Ecdysis (1 CMD): Discard 1 damage token.",
    "This fleet has access to the following Command: Priority Delivery (1 CMD): Jump In a unit.",
    "Units in this fleet have access to the following command: Tractor Beam Locked On (1 CMD): Give a Trapped token.",
    "You cannot form mixed Battlegroups. Also gains: Alliance of Necessity (1 CMD): Count as another species.",
  ];
  for (const text of shapes) {
    const e = deriveCommandEffects([{ name: "Rule", text }]);
    assert.equal(e.granted.length, 1, `no grant read from: ${text}`);
    assert.equal(e.granted[0]?.cost, 1);
  }
});

test("a rule that is itself a command takes the rule's name", () => {
  const e = deriveCommandEffects([
    {
      name: "Reactive Protocols",
      text: "(1 CMD): At the start of any player's battlegroup activation, spend 1 CMD token to reorder the activation steps.",
    },
  ]);
  assert.equal(e.granted[0]?.name, "Reactive Protocols");
  assert.equal(e.granted[0]?.cost, 1);
});

test("reads a cost change, its cap and its scope", () => {
  const e = deriveCommandEffects([
    { name: "Value", text: "Each unit in this fleet can use the Power to Engines command for 0 CMD once per Round." },
  ]);
  assert.equal(e.costChanges.length, 1);
  assert.deepEqual(
    { ...e.costChanges[0] },
    { command: "Power to Engines", cost: 0, limit: "once per Round", source: "Value" },
  );

  const scoped = deriveCommandEffects([
    { name: "Swarm", text: "Mass 0 units in this fleet can take the Red Alert command for 0 CMD Tokens." },
  ]);
  assert.equal(scoped.costChanges[0]?.command, "Red Alert");
  assert.equal(scoped.costChanges[0]?.cost, 0);
  assert.equal(scoped.costChanges[0]?.scope, "Mass 0 units in this fleet");
});

test("splits a multi-command discount into one change each", () => {
  const e = deriveCommandEffects([
    {
      name: "Overcharged",
      text: "This unit reduces the cost of the 'Power to Weapons' and 'Power to Shields' commands to 0 CMD tokens.",
    },
  ]);
  assert.deepEqual(
    e.costChanges.map((c) => c.command).sort(),
    ["Power to Shields", "Power to Weapons"],
  );
  assert.ok(e.costChanges.every((c) => c.cost === 0));
});

test("records a rule that changes how a command resolves, not its cost", () => {
  const e = deriveCommandEffects([
    {
      name: "Overwatch",
      text: "When ships in this unit's battlegroup use the Power to Weapons command, they subtract 2 from the result of each attack dice, instead of 1.",
    },
  ]);
  assert.equal(e.costChanges.length, 0);
  assert.equal(e.notes[0]?.command, "Power to Weapons");
  assert.match(e.notes[0]?.text ?? "", /subtract 2/);
});

test("does not invent a grant from a core command's name", () => {
  const e = deriveCommandEffects([
    { name: "Cheap", text: "Ships in this fleet can use the 'Red Alert' command for 0 CMD tokens." },
  ]);
  assert.equal(e.granted.length, 0);
  assert.equal(e.costChanges[0]?.command, "Red Alert");
});

test("stays silent on rules that touch no command", () => {
  const e = deriveCommandEffects([
    { name: "Untargetable", text: "Enemy units cannot target Vyke units within 3\" of them." },
    { name: "Stockpile", text: "You keep your unspent CMD tokens from one round to the next." },
  ]);
  assert.deepEqual(e, { granted: [], costChanges: [], notes: [], global: [] });
});

test("effectiveCost takes the discount, and never raises the cost", () => {
  const changes = [{ command: "Red Alert", cost: 0, source: "Cheap" }];
  assert.equal(effectiveCost("Red Alert", 1, changes).cost, 0);
  assert.equal(effectiveCost("Red Alert", 1, changes).change?.source, "Cheap");
  assert.equal(effectiveCost("All Hands", 1, changes).cost, 1);
  assert.equal(effectiveCost("Red Alert", 1, [{ command: "Red Alert", cost: 2, source: "x" }]).cost, 1);
});

// The point of parsing rather than hard-coding: every published faction whose
// rule mentions a command should yield something. If this fails, the parser has
// silently stopped understanding house wording.
test("every published rule mentioning a command is understood", async () => {
  const factions = await allFactions();
  assert.ok(factions.length >= 12, `expected the whole faction folder, got ${factions.length}`);
  const unread: string[] = [];
  let read = 0;
  for (const f of factions) {
    const rules = [
      { name: f.rule.name, text: f.rule.text },
      ...f.hvp.map((h) => ({ name: h.name, text: h.rule })),
    ];
    for (const r of rules) {
      // In scope: a rule that DEFINES a command ("Name (1 CMD): ...") or refers
      // to a core one ("the Red Alert command"). Deliberately not in scope:
      // "In the Command Phase, you gain 3 CMD tokens" (token economy, no command
      // involved) and "Units in this fleet gain: <a rule>" (grants a rule, not a
      // command). Silence on those is the correct read, not a miss.
      const refersToCommand = /\b(?:the|following)\s+[\w'"‘’“” ]*?commands?\b/i.test(r.text.replace(/Command Phase/gi, ""));
      if (!/\(\d+\s*CMD\)\s*:/.test(r.text) && !refersToCommand) continue;
      const e = deriveCommandEffects([r]);
      const found = e.granted.length + e.costChanges.length + e.notes.length + e.global.length;
      if (found === 0) unread.push(`${f.name} / ${r.name}: ${r.text.slice(0, 90)}`);
      else read += found;
    }
  }
  assert.deepEqual(unread, [], `rules mentioning a command but read as nothing:\n${unread.join("\n")}`);
  // Guards the other direction: a parser that matched nothing at all would pass
  // the check above trivially, since nothing would be in scope either.
  assert.ok(read >= 20, `expected the full corpus to yield effects, only read ${read}`);
});
