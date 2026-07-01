import type { AllianceSpecies, FleetUnit } from "../src/types.ts";
import { getFaction, maxUnitSize, HVP_REQUIRED } from "../src/index.ts";
import { store, nextUnitId } from "./state.ts";

export function setFaction(factionId: string): void {
  store.setState((s) => ({
    ...s,
    // Switching faction invalidates every unit/HVP reference (different roster).
    fleet: { ...s.fleet, factionId, units: [], hvp: [] },
  }));
}

export function setCreditsLimit(limit: number): void {
  store.setState((s) => ({ ...s, fleet: { ...s.fleet, creditsLimit: limit } }));
}

export function setFleetName(name: string): void {
  store.setState((s) => ({ ...s, fleet: { ...s.fleet, name } }));
}

export function addUnit(shipClassId: string): void {
  store.setState((s) => {
    const id = nextUnitId(s);
    const unit: FleetUnit = { id, shipClassId, count: 1 };
    return {
      ...s,
      nextUnitSeq: s.nextUnitSeq + 1,
      fleet: { ...s.fleet, units: [...s.fleet.units, unit] },
    };
  });
}

export function removeUnit(unitId: string): void {
  store.setState((s) => ({
    ...s,
    fleet: {
      ...s.fleet,
      units: s.fleet.units.filter((u) => u.id !== unitId),
      // Drop any HVP assignment pointing at the removed unit, but keep the HVP selected.
      hvp: s.fleet.hvp.map((h) => (h.assignedUnitId === unitId ? { hvpId: h.hvpId } : h)),
    },
  }));
}

export function setUnitCount(unitId: string, count: number): void {
  store.setState((s) => {
    const faction = getFaction(s.fleet.factionId);
    return {
      ...s,
      fleet: {
        ...s.fleet,
        units: s.fleet.units.map((u) => {
          if (u.id !== unitId) return u;
          const ship = faction?.ships.find((sc) => sc.id === u.shipClassId);
          const max = ship ? maxUnitSize(ship.mass) : 3;
          return { ...u, count: Math.min(Math.max(1, count), max) };
        }),
      },
    };
  });
}

export function incrementUnit(unitId: string): void {
  const unit = store.getState().fleet.units.find((u) => u.id === unitId);
  if (unit) setUnitCount(unitId, unit.count + 1);
}

export function decrementUnit(unitId: string): void {
  const unit = store.getState().fleet.units.find((u) => u.id === unitId);
  if (!unit) return;
  if (unit.count <= 1) removeUnit(unitId);
  else setUnitCount(unitId, unit.count - 1);
}

export function setUnitSpecies(unitId: string, species: AllianceSpecies | undefined): void {
  store.setState((s) => ({
    ...s,
    fleet: {
      ...s.fleet,
      units: s.fleet.units.map((u) => {
        if (u.id !== unitId) return u;
        if (species === undefined) {
          const { species: _drop, ...rest } = u;
          return rest;
        }
        return { ...u, species };
      }),
    },
  }));
}

export function toggleHvp(hvpId: string): void {
  store.setState((s) => {
    const selected = s.fleet.hvp.some((h) => h.hvpId === hvpId);
    if (selected) {
      return { ...s, fleet: { ...s.fleet, hvp: s.fleet.hvp.filter((h) => h.hvpId !== hvpId) } };
    }
    if (s.fleet.hvp.length >= HVP_REQUIRED) return s;
    return { ...s, fleet: { ...s.fleet, hvp: [...s.fleet.hvp, { hvpId }] } };
  });
}

export function setHvpAssignment(hvpId: string, unitId: string | undefined): void {
  store.setState((s) => ({
    ...s,
    fleet: {
      ...s.fleet,
      hvp: s.fleet.hvp.map((h) => {
        if (h.hvpId !== hvpId) return h;
        return unitId ? { hvpId, assignedUnitId: unitId } : { hvpId };
      }),
    },
  }));
}
