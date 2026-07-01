import type { Faction, Hvp, ShipClass } from "../types.ts";
import { GENERIC_HVP } from "./generic-hvp.ts";
import { VYKE } from "./factions/vyke.ts";
import { AEGIS } from "./factions/aegis.ts";
import { GEN_OMEGA } from "./factions/gen-omega.ts";
import { ALLIANCE } from "./factions/alliance.ts";

export { GENERIC_HVP };

/** All Armageddon-era factions (Phase 1). */
export const ARMAGEDDON_FACTIONS: Faction[] = [VYKE, AEGIS, GEN_OMEGA, ALLIANCE];

/** All factions currently in the catalog. */
export const FACTIONS: Faction[] = [...ARMAGEDDON_FACTIONS];

const FACTION_BY_ID = new Map<string, Faction>(FACTIONS.map((f) => [f.id, f]));

export function getFaction(id: string): Faction | undefined {
  return FACTION_BY_ID.get(id);
}

export function getShipClass(faction: Faction, shipClassId: string): ShipClass | undefined {
  return faction.ships.find((s) => s.id === shipClassId);
}

/**
 * The Catalog is the data surface the validator reads from. Defaulting to the
 * real rosters, but injectable so tests can supply fixtures.
 */
export interface Catalog {
  getFaction(id: string): Faction | undefined;
  genericHvp: Hvp[];
}

export const defaultCatalog: Catalog = {
  getFaction,
  genericHvp: GENERIC_HVP,
};
