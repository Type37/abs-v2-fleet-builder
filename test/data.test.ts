import { test } from "node:test";
import assert from "node:assert/strict";

import { ARMAGEDDON_FACTIONS, FACTIONS, GENERIC_HVP, getFaction } from "../src/data/index.ts";
import { DAMAGE_BY_DIE } from "../src/types.ts";

const DIE_TYPES = new Set(Object.keys(DAMAGE_BY_DIE));

test("there are exactly 4 Armageddon factions", () => {
  assert.equal(ARMAGEDDON_FACTIONS.length, 4);
  assert.deepEqual(
    ARMAGEDDON_FACTIONS.map((f) => f.id).sort(),
    ["aegis", "alliance", "gen-omega", "vyke"],
  );
});

test("faction ids are unique", () => {
  const ids = FACTIONS.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every faction has a roster and 7 HVP, all Armageddon-era", () => {
  for (const f of FACTIONS) {
    assert.ok(f.ships.length > 0, `${f.id} has ships`);
    assert.equal(f.hvp.length, 7, `${f.id} has 7 HVP`);
    assert.equal(f.era, "Armageddon");
  }
});

test("ship ids are unique within each faction", () => {
  for (const f of FACTIONS) {
    const ids = f.ships.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, `${f.id} ship ids unique`);
  }
});

test("HVP ids are globally unique across factions + generic", () => {
  const all = [...FACTIONS.flatMap((f) => f.hvp), ...GENERIC_HVP].map((h) => h.id);
  assert.equal(new Set(all).size, all.length);
});

test("ship stats are internally consistent", () => {
  for (const f of FACTIONS) {
    for (const s of f.ships) {
      assert.ok([0, 1, 2, 3].includes(s.mass), `${s.id} mass in range`);
      assert.ok(Number.isInteger(s.cost) && s.cost > 0, `${s.id} cost is positive int`);
      assert.ok(s.silhouette > 0, `${s.id} silhouette > 0`);
      assert.ok(s.shields >= 0, `${s.id} shields >= 0`);
      assert.ok(s.thrust > 0, `${s.id} thrust > 0`);
      // A ship has at least one weapon system OR utility bays.
      const hasWeapon = s.primary.length > 0 || s.auxiliary.length > 0;
      assert.ok(hasWeapon || s.utilityBays, `${s.id} has weapons or utility bays`);
      for (const wpn of [...s.primary, ...s.auxiliary]) {
        assert.ok(DIE_TYPES.has(wpn.die), `${s.id} ${wpn.name} valid die`);
        assert.ok(wpn.count > 0, `${s.id} ${wpn.name} count > 0`);
        assert.ok(wpn.rangeMin >= 0 && wpn.rangeMax >= wpn.rangeMin, `${s.id} ${wpn.name} range ok`);
      }
    }
  }
});

test("spot-check known stat blocks from the rulebook", () => {
  const vyke = getFaction("vyke")!;
  const leviathan = vyke.ships.find((s) => s.id === "leviathan")!;
  assert.equal(leviathan.mass, 3);
  assert.equal(leviathan.cost, 52);
  assert.equal(leviathan.silhouette, 9);

  const aegis = getFaction("aegis")!;
  const imperator = aegis.ships.find((s) => s.id === "imperator")!;
  assert.equal(imperator.cost, 75);
  assert.equal(imperator.mass, 3);
  assert.equal(imperator.primary[0]!.die, "D12");

  const alliance = getFaction("alliance")!;
  assert.equal(alliance.requiresSpecies, true);

  const gen = getFaction("gen-omega")!;
  const punk = gen.hvp.find((h) => h.id === "the-nameless-punk")!;
  assert.equal(punk.canEmbarkMass0, true);
});

test("Mass 3 ships exist in every faction (capital ships)", () => {
  for (const f of FACTIONS) {
    assert.ok(f.ships.some((s) => s.mass === 3), `${f.id} has a Mass 3 ship`);
  }
});
