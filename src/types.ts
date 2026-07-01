// Core domain types for A Billion Suns 2E fleet building.
// These are shared across all eras; Phase 1 only exercises the Armageddon subset.

export type Era = "Hypergrowth" | "Age of Unity" | "Armageddon";

/** Ship Mass. Drives unit-size limits: Mass 3 units are always a single ship. */
export type Mass = 0 | 1 | 2 | 3;

export type DieType = "D6" | "D8" | "D10" | "D12";

/** Damage per unsaved hit is fixed by the attack-die type (rules p.42). */
export const DAMAGE_BY_DIE: Record<DieType, number> = {
  D6: 1,
  D8: 2,
  D10: 3,
  D12: 5,
};

/** The Alliance of Non-Human Worlds tags every unit with a species (Fractious Coalition). */
export type AllianceSpecies = "Rannari" | "Yynnx" | "Gorgronti";
export const ALLIANCE_SPECIES: readonly AllianceSpecies[] = ["Rannari", "Yynnx", "Gorgronti"];

export interface Weapon {
  name: string;
  /** Number of attack dice (the N in "NdX"). */
  count: number;
  die: DieType;
  /** Inches. */
  rangeMin: number;
  rangeMax: number;
}

export interface ShipClass {
  /** Unique within a faction. */
  id: string;
  name: string;
  mass: Mass;
  /** Movement, in inches. */
  thrust: number;
  /** Silhouette: highest die roll that hits, and the ship's starting HP. */
  silhouette: number;
  shields: number;
  /** Primary weapon systems (45° arc). Empty if the primary slot holds Utility Bays. */
  primary: Weapon[];
  /** Auxiliary weapon systems (180° arc). Empty if the aux slot holds Utility Bays. */
  auxiliary: Weapon[];
  /** True if a weapon slot is "Utility Bays" — makes the ship a Utility Ship. */
  utilityBays: boolean;
  /** Cost in billions of credits, per single ship of this class. */
  cost: number;
}

export interface Hvp {
  /** Unique across the whole catalog (faction + generic). */
  id: string;
  name: string;
  rule: string;
  /** True if this HVP may be carried by a Mass 0 unit (e.g. Gen Ω "The Nameless Punk"). */
  canEmbarkMass0?: boolean;
}

export interface FactionRule {
  name: string;
  text: string;
}

export interface Faction {
  id: string;
  name: string;
  era: Era;
  /** Initiative dice pool, e.g. "2D6" (kept as text; not used by build validation). */
  initiative: string;
  /** CMD tokens per Command Phase, e.g. "9" or "D12" (text; not used by build validation). */
  cmdTokens: string;
  rule: FactionRule;
  ships: ShipClass[];
  hvp: Hvp[];
  /** When true, every unit in a fleet must declare a species (Alliance only). */
  requiresSpecies?: boolean;
}

// ---------------------------------------------------------------------------
// Fleet list (the thing the user builds)
// ---------------------------------------------------------------------------

export interface FleetUnit {
  /** Instance id, unique within the fleet. Referenced by HVP assignments. */
  id: string;
  /** References a ShipClass.id within the selected faction. */
  shipClassId: string;
  /** Number of ships in this unit. */
  count: number;
  /** Required only when the faction requires species (Alliance). */
  species?: AllianceSpecies;
}

export interface FleetHvp {
  /** References an Hvp.id from the faction list or the generic list. */
  hvpId: string;
  /** Optional at build time; if set, must reference a fleet unit (Mass >= 1 except Nameless Punk). */
  assignedUnitId?: string;
}

export interface Fleet {
  name?: string;
  factionId: string;
  /** Agreed credits limit. Canonical Armageddon values: 300 / 400 / 500. */
  creditsLimit: number;
  units: FleetUnit[];
  hvp: FleetHvp[];
}
