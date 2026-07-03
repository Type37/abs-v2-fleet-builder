import type { Faction, Fleet, GameMode } from "../src/types.ts";

// localStorage persistence. One key per concern, JSON payloads, versioned so a
// future format change can migrate instead of clobber.

const LISTS_KEY = "abs2.lists.v1";
const FACTIONS_KEY = "abs2.customFactions.v1";

export interface SavedList {
  id: string;
  mode: GameMode;
  /** Free Play: no faction lock, no rules enforcement, any limit. */
  freePlay: boolean;
  /** Emblem id from the emblem set. */
  emblem: string;
  fleet: Fleet;
  createdAt: string;
  updatedAt: string;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the app keeps working in memory.
  }
}

export function loadLists(): SavedList[] {
  return read<SavedList[]>(LISTS_KEY, []);
}

export function persistLists(lists: SavedList[]): void {
  write(LISTS_KEY, lists);
}

export function loadCustomFactions(): Faction[] {
  return read<Faction[]>(FACTIONS_KEY, []);
}

export function persistCustomFactions(factions: Faction[]): void {
  write(FACTIONS_KEY, factions);
}

export function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
