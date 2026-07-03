import type { Faction, Fleet, GameMode } from "../src/types.ts";
import { loadCustomFactions, loadLists, newId, persistCustomFactions, persistLists } from "./storage.ts";
import type { SavedList } from "./storage.ts";

// A minimal store: state + subscribers, no framework. The whole app re-renders
// on every change (main.ts).

export type Listener = () => void;

export interface Store<T> {
  getState(): T;
  setState(updater: (state: T) => T): void;
  subscribe(fn: Listener): () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    getState: () => state,
    setState(updater) {
      state = updater(state);
      for (const l of listeners) l();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

export type Route =
  | { view: "home" }
  | { view: "builder"; listId: string }
  | { view: "print"; listId: string }
  | { view: "foundry"; factionId?: string }
  | { view: "changelog" };

export function parseRoute(hash: string): Route {
  const h = hash.replace(/^#/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts[0] === "list" && parts[1]) return { view: "builder", listId: parts[1] };
  if (parts[0] === "print" && parts[1]) return { view: "print", listId: parts[1] };
  if (parts[0] === "foundry") return parts[1] ? { view: "foundry", factionId: parts[1] } : { view: "foundry" };
  if (parts[0] === "changelog") return { view: "changelog" };
  return { view: "home" };
}

export function routeHash(route: Route): string {
  switch (route.view) {
    case "home":
      return "#/";
    case "builder":
      return `#/list/${route.listId}`;
    case "print":
      return `#/print/${route.listId}`;
    case "foundry":
      return route.factionId ? `#/foundry/${route.factionId}` : "#/foundry";
    case "changelog":
      return "#/changelog";
  }
}

// ---------------------------------------------------------------------------
// App state
// ---------------------------------------------------------------------------

export interface AppState {
  route: Route;
  lists: SavedList[];
  customFactions: Faction[];
  /** Monotonic counter for generating unit instance ids within the active list. */
  nextUnitSeq: number;
  /** Transient UI state, never persisted. */
  ui: {
    /** Unit id whose per-ship naming panel is open. */
    openShipNames?: string;
    /** Toast message shown briefly after copy actions. */
    toast?: string;
    /** Faction picker: show every era, not just the list's era. */
    showAllFactions: boolean;
  };
}

export function initialState(): AppState {
  return {
    route: parseRoute(location.hash),
    lists: loadLists(),
    customFactions: loadCustomFactions(),
    nextUnitSeq: 1,
    ui: { showAllFactions: false },
  };
}

export const store = createStore<AppState>(initialState());

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export function activeList(state: AppState): SavedList | undefined {
  const r = state.route;
  if (r.view !== "builder" && r.view !== "print") return undefined;
  return state.lists.find((l) => l.id === r.listId);
}

export function createList(mode: GameMode, factionId: string, freePlay: boolean): SavedList {
  const now = new Date().toISOString();
  const fleet: Fleet = { name: "", factionId, creditsLimit: 300, units: [], hvp: [] };
  return {
    id: newId("fl"),
    mode,
    freePlay,
    emblem: "delta",
    fleet,
    createdAt: now,
    updatedAt: now,
  };
}

/** Immutably update one saved list and persist the registry. */
export function updateList(state: AppState, listId: string, fn: (l: SavedList) => SavedList): AppState {
  const lists = state.lists.map((l) =>
    l.id === listId ? { ...fn(l), updatedAt: new Date().toISOString() } : l,
  );
  persistLists(lists);
  return { ...state, lists };
}

export function updateFleet(state: AppState, listId: string, fn: (f: Fleet) => Fleet): AppState {
  return updateList(state, listId, (l) => ({ ...l, fleet: fn(l.fleet) }));
}

export function persistAll(state: AppState): void {
  persistLists(state.lists);
  persistCustomFactions(state.customFactions);
}

/** Highest existing unit sequence in a fleet, so new ids never collide. */
export function nextUnitIdFor(fleet: Fleet): string {
  let max = 0;
  for (const u of fleet.units) {
    const m = /^u(\d+)$/.exec(u.id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `u${max + 1}`;
}
