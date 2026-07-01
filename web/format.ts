import type { ShipClass, Weapon } from "../src/types.ts";
import { DAMAGE_BY_DIE } from "../src/types.ts";

export function formatWeapon(weapon: Weapon): string {
  const dmg = DAMAGE_BY_DIE[weapon.die];
  return `${weapon.name} — ${weapon.count}${weapon.die}, ${weapon.rangeMin}–${weapon.rangeMax}″ (dmg ${dmg})`;
}

/** What to print in the roster's Primary column: the weapons, "Utility Bays", or a dash. */
export function primarySlotText(ship: ShipClass): string {
  if (ship.primary.length > 0) return ship.primary.map(formatWeapon).join("<br />");
  if (ship.utilityBays) return "Utility Bays";
  return "—";
}

/** Same, for the Auxiliary column. */
export function auxSlotText(ship: ShipClass): string {
  if (ship.auxiliary.length > 0) return ship.auxiliary.map(formatWeapon).join("<br />");
  if (ship.utilityBays) return "Utility Bays";
  return "—";
}

export function credits(n: number): string {
  return `¢${n}bn`;
}

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c] ?? c);
}
