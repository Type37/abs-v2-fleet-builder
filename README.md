# ABS-V2 — A Billion Suns 2E Fleet Builder

A fleet/army builder for **A Billion Suns, 2nd Edition** (Mike Hutchinson / Osprey Games).

**Phase 1 — Armageddon era, validation engine first.** No UI yet. The goal of this
phase is a correct, well-tested rules engine for building and validating a fleet
list, which later phases (UI, Age of Unity, Hypergrowth) build on top of.

## Running

Requires Node ≥ 22.6 (TypeScript runs natively via type-stripping — no build step,
no dependencies).

```bash
npm test          # run the validation + data test suites
npm run test:watch
```

Type-checking is optional and needs TypeScript installed (`npm i -D typescript`),
then `npm run typecheck`.

## Layout

```
src/
  types.ts              Domain model (Faction, ShipClass, Hvp, Fleet, ...)
  validation.ts         validateFleet() — the rules engine
  data/
    factions/           The 4 Armageddon factions (Vyke, AEGIS, Gen Ω, Alliance)
    generic-hvp.ts      The 5 generic High-Value Personnel
    index.ts            Catalog registry
test/
  data.test.ts          Roster data-integrity checks
  validation.test.ts    Rule-by-rule validation coverage
```

## Armageddon list-building rules enforced

A fleet = a chosen **faction**, an agreed **credits limit**, a set of **units**, and
exactly **3 HVP**.

| Code | Severity | Rule |
|------|----------|------|
| `FACTION_UNKNOWN` | error | Faction id must exist. |
| `FLEET_EMPTY` | error | At least one unit required. |
| `LIMIT_INVALID` | error | Credits limit must be a positive integer. |
| `LIMIT_NONSTANDARD` | warning | Armageddon uses ¢300 / 400 / 500bn; others are allowed but flagged. |
| `OVER_BUDGET` | error | Σ(ship cost × count) must not exceed the limit. |
| `UNIT_NOT_IN_ROSTER` | error | Each unit's ship class must belong to the faction. |
| `UNIT_COUNT_INVALID` | error | A unit must hold ≥ 1 ship. |
| `UNIT_SIZE_EXCEEDED` | error | Max 3 ships/unit; **Mass 3 ships → exactly 1**. |
| `UNIT_ID_DUPLICATE` | error | Unit instance ids must be unique. |
| `UNIT_SPECIES_REQUIRED` | error | Alliance only: every unit declares a species. |
| `UNIT_SPECIES_INVALID` | error | Species must be Rannari / Yynnx / Gorgronti. |
| `UNIT_SPECIES_UNEXPECTED` | warning | Species set on a non-Alliance faction (ignored). |
| `HVP_COUNT` | error | Exactly 3 HVP. |
| `HVP_DUPLICATE` | error | Each HVP is unique. |
| `HVP_NOT_AVAILABLE` | error | HVP must be a faction HVP or a generic one. |
| `HVP_ASSIGN_UNKNOWN_UNIT` | error | An assigned HVP must reference a real unit. |
| `HVP_ASSIGN_MASS0` | error | HVP ride Mass ≥ 1 units (except Gen Ω *The Nameless Punk*). |
| `HVP_NO_CARRIER` | warning | No Mass 1+ unit exists to carry the chosen HVP. |

`validateFleet(fleet)` returns `{ valid, totalCost, creditsRemaining, errors, warnings, issues }`.

## What this phase deliberately omits

Play-time concepts that are **not** list-building constraints: battlegroups,
squadron carry capacity, Mother's Wing, jump points, missions, scoring. These belong
to a future game-state layer, not the builder.
