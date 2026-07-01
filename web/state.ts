import type { Fleet } from "../src/types.ts";

// A minimal store: state + subscribers, no framework. The whole app re-renders
// on every change (main.ts), which is plenty for a form this size.

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

export interface AppState {
  fleet: Fleet;
  /** Monotonic counter for generating unit instance ids ("u1", "u2", ...). */
  nextUnitSeq: number;
}

export function initialState(): AppState {
  return {
    fleet: {
      name: "",
      factionId: "vyke",
      creditsLimit: 300,
      units: [],
      hvp: [],
    },
    nextUnitSeq: 1,
  };
}

export function nextUnitId(state: AppState): string {
  return `u${state.nextUnitSeq}`;
}

export const store = createStore<AppState>(initialState());
