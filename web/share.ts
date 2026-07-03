import type { AllianceSpecies, Faction, Fleet, GameMode } from "../src/types.ts";
import type { SavedList } from "./storage.ts";
import { newId } from "./storage.ts";

// List <-> URL codec. JSON, trimmed keys, base64url in the location hash after
// "#s=". No server: the link IS the list. When the list uses a Foundry-made
// faction, the whole faction definition rides along so the link works anywhere.

interface UnitTuple {
  s: string; // shipClassId
  c: number; // count
  p?: AllianceSpecies; // species
  n?: string; // unit name
  m?: string[]; // ship names
}

interface HvpTuple {
  h: string; // hvpId
  u?: number; // assigned unit index
  n?: string; // custom personal name
}

interface PayloadV2 {
  v: 2;
  d: GameMode; // mode
  f: string; // factionId
  c: number; // creditsLimit
  n?: string; // fleet name
  e?: string; // emblem id
  x?: boolean; // free play
  u: UnitTuple[];
  h: HvpTuple[];
  cf?: Faction; // embedded custom faction
}

// Legacy v1 payload (pre-0.2.0 links): keep decoding forever.
interface PayloadV1 {
  n?: string;
  f: string;
  c: number;
  u: Array<[string, number, AllianceSpecies?]>;
  h: Array<[string, number?]>;
}

function toB64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(s: string): string {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeList(list: SavedList, customFaction?: Faction): string {
  const fleet = list.fleet;
  const payload: PayloadV2 = {
    v: 2,
    d: list.mode,
    f: fleet.factionId,
    c: fleet.creditsLimit,
    u: fleet.units.map((u) => {
      const t: UnitTuple = { s: u.shipClassId, c: u.count };
      if (u.species) t.p = u.species;
      if (u.name) t.n = u.name;
      if (u.shipNames?.some((s) => s)) t.m = u.shipNames;
      return t;
    }),
    h: fleet.hvp.map((h) => {
      const t: HvpTuple = { h: h.hvpId };
      const idx = h.assignedUnitId ? fleet.units.findIndex((u) => u.id === h.assignedUnitId) : -1;
      if (idx >= 0) t.u = idx;
      if (h.customName) t.n = h.customName;
      return t;
    }),
  };
  if (fleet.name) payload.n = fleet.name;
  if (list.emblem && list.emblem !== "delta") payload.e = list.emblem;
  if (list.freePlay) payload.x = true;
  if (customFaction) payload.cf = customFaction;
  return toB64Url(JSON.stringify(payload));
}

export interface DecodedShare {
  list: SavedList;
  customFaction?: Faction;
}

/** Decode a share payload (v2 or legacy v1) into a fresh SavedList. */
export function decodeShare(raw: string): DecodedShare | null {
  try {
    const parsed = JSON.parse(fromB64Url(raw)) as PayloadV2 | PayloadV1;
    const now = new Date().toISOString();

    if ((parsed as PayloadV2).v === 2) {
      const p = parsed as PayloadV2;
      if (typeof p.f !== "string" || !Array.isArray(p.u) || !Array.isArray(p.h)) return null;
      const units = p.u.map((t, i) => ({
        id: `u${i + 1}`,
        shipClassId: t.s,
        count: t.c,
        ...(t.p ? { species: t.p } : {}),
        ...(t.n ? { name: t.n } : {}),
        ...(t.m ? { shipNames: t.m } : {}),
      }));
      const hvp = p.h.map((t) => ({
        hvpId: t.h,
        ...(typeof t.u === "number" && units[t.u] ? { assignedUnitId: units[t.u]!.id } : {}),
        ...(t.n ? { customName: t.n } : {}),
      }));
      const fleet: Fleet = { name: p.n ?? "", factionId: p.f, creditsLimit: p.c, units, hvp };
      const list: SavedList = {
        id: newId("fl"),
        mode: p.d ?? "armageddon",
        freePlay: p.x === true,
        emblem: p.e ?? "delta",
        fleet,
        createdAt: now,
        updatedAt: now,
      };
      return p.cf ? { list, customFaction: p.cf } : { list };
    }

    const p = parsed as PayloadV1;
    if (typeof p.f !== "string" || typeof p.c !== "number" || !Array.isArray(p.u)) return null;
    const units = p.u.map(([shipClassId, count, species], i) => ({
      id: `u${i + 1}`,
      shipClassId,
      count,
      ...(species ? { species } : {}),
    }));
    const hvp = (p.h ?? []).map(([hvpId, idx]) =>
      typeof idx === "number" && units[idx] ? { hvpId, assignedUnitId: units[idx]!.id } : { hvpId },
    );
    return {
      list: {
        id: newId("fl"),
        mode: "armageddon",
        freePlay: false,
        emblem: "delta",
        fleet: { name: p.n ?? "", factionId: p.f, creditsLimit: p.c, units, hvp },
        createdAt: now,
        updatedAt: now,
      },
    };
  } catch {
    return null;
  }
}

/** Extract a share payload from a URL hash, handling both "#s=..." and legacy raw payloads. */
export function sharePayloadFromHash(hash: string): string | null {
  const h = hash.replace(/^#/, "");
  if (h.startsWith("s=")) return h.slice(2);
  // Legacy links put the payload directly in the hash. Route hashes start with
  // "/", payloads never do.
  if (h && !h.startsWith("/")) return h;
  return null;
}

export function shareUrl(list: SavedList, customFaction?: Faction): string {
  const encoded = encodeList(list, customFaction);
  return `${location.origin}${location.pathname}#s=${encoded}`;
}
