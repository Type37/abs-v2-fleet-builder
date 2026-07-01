import type { Weapon, DieType } from "../types.ts";

/** Concise weapon constructor, e.g. w("Mandibles", 1, "D8", 0, 2). */
export function w(name: string, count: number, die: DieType, rangeMin: number, rangeMax: number): Weapon {
  return { name, count, die, rangeMin, rangeMax };
}
