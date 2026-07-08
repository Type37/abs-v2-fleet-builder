// Plain-text / Markdown export of a fleet list, for pasting into Discord,
// forums, or a notes app. Built from the same catalogue the builder uses.

import type { Faction, Hvp } from "../src/types.ts";
import { GENERIC_HVP } from "../src/data/index.ts";
import { credits, formatWeapon } from "./format.ts";
import { findFaction } from "./catalog.ts";
import { resolveShip, listTotals } from "./render.ts";
import type { SavedList } from "./storage.ts";

function hvpDef(id: string, faction: Faction | undefined): Hvp | undefined {
  return faction?.hvp.find((x) => x.id === id) ?? GENERIC_HVP.find((x) => x.id === id);
}

const MODE_ERA: Record<string, string> = {
  armageddon: "Armageddon",
  "age-of-unity": "Age of Unity",
  hypergrowth: "Hypergrowth",
  "combat-simulator": "Combat Simulator",
  "management-training": "Management Training",
};

/** Render a fleet as Markdown. Reflects only the ships and personnel chosen. */
export function fleetToMarkdown(list: SavedList, customs: Faction[]): string {
  const faction = findFaction(list.fleet.factionId, customs);
  const { total } = listTotals(list, customs);
  const era = MODE_ERA[list.mode] ?? "";
  const lines: string[] = [];

  lines.push(`# ${list.fleet.name || "Unnamed fleet"}`);
  const sub = [faction?.name ?? "Mixed forces", era].filter(Boolean).join(" — ");
  lines.push(`${sub} · ${credits(total)} of ${credits(list.fleet.creditsLimit)}`);
  if (faction) lines.push(`**${faction.rule.name}:** ${faction.rule.text}`);
  lines.push("");

  lines.push("## Units");
  if (list.fleet.units.length === 0) {
    lines.push("_No units._");
  } else {
    for (const u of list.fleet.units) {
      const r = resolveShip(u.shipClassId, faction, customs);
      const ship = r?.ship;
      const name = u.name || `${ship?.name ?? u.shipClassId} unit`;
      const cost = ship ? ship.cost * u.count : 0;
      lines.push(`- **${name}** — ${u.count}× ${ship?.name ?? u.shipClassId} (Mass ${ship?.mass ?? "?"}), ${credits(cost)}`);
      if (ship) {
        const weapons = [...ship.primary, ...ship.auxiliary].map(formatWeapon);
        for (const wline of weapons) lines.push(`    - ${wline}`);
      }
      const carried = list.fleet.hvp.filter((h) => h.assignedUnitId === u.id);
      for (const h of carried) {
        const def = hvpDef(h.hvpId, faction);
        lines.push(`    - Carrying: ${h.customName ? `${h.customName}, ` : ""}${def?.name ?? h.hvpId}`);
      }
    }
  }
  lines.push("");

  lines.push("## High-Value Personnel");
  if (list.fleet.hvp.length === 0) {
    lines.push("_None selected._");
  } else {
    for (const sel of list.fleet.hvp) {
      const def = hvpDef(sel.hvpId, faction);
      const name = sel.customName ? `${sel.customName}, ${def?.name ?? sel.hvpId}` : (def?.name ?? sel.hvpId);
      lines.push(`- **${name}**${def ? `: ${def.rule}` : ""}`);
    }
  }

  if (list.fleet.notes?.trim()) {
    lines.push("");
    lines.push("## Notes");
    lines.push(list.fleet.notes.trim());
  }

  return lines.join("\n");
}
