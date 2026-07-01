// Public API for the ABS-V2 builder core (Phase 1: Armageddon validation).
export * from "./types.ts";
export {
  FACTIONS,
  ARMAGEDDON_FACTIONS,
  GENERIC_HVP,
  getFaction,
  getShipClass,
  defaultCatalog,
  type Catalog,
} from "./data/index.ts";
export {
  validateFleet,
  fleetCost,
  maxUnitSize,
  STANDARD_LIMITS,
  HVP_REQUIRED,
  type ValidationResult,
  type ValidationIssue,
  type IssueCode,
  type Severity,
} from "./validation.ts";
