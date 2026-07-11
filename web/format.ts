import type { ShipClass, Weapon } from "../src/types.ts";
import { DAMAGE_BY_DIE } from "../src/types.ts";

// Project style rules: no abbreviations in anything user-visible, no monospace,
// and a hard budget of one em-dash and one interpunct across the whole project
// (both are spent in the print document, nowhere else).

export function formatWeapon(weapon: Weapon): string {
  const dmg = DAMAGE_BY_DIE[weapon.die];
  return `${weapon.name}: ${weapon.count}${weapon.die}, range ${weapon.rangeMin}-${weapon.rangeMax}", damage ${dmg}`;
}

/** Primary column content: full weapon lines, "Utility Bays", or "None". */
export function primarySlotText(ship: ShipClass): string {
  if (ship.primary.length > 0) return ship.primary.map(formatWeapon).join("<br />");
  if (ship.primaryUtility) return "Utility Bays";
  if (ship.utilityBays && !ship.auxiliaryUtility && ship.auxiliary.length > 0) return "Utility Bays";
  if (ship.utilityBays && ship.auxiliary.length === 0 && !ship.auxiliaryFitting) return "Utility Bays";
  return "None";
}

/** Auxiliary column content. */
export function auxSlotText(ship: ShipClass): string {
  if (ship.auxiliary.length > 0) return ship.auxiliary.map(formatWeapon).join("<br />");
  if (ship.auxiliaryFitting) return ship.auxiliaryFitting;
  if (ship.auxiliaryUtility) return "Utility Bays";
  return "None";
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

/**
 * Escape rules prose for display. Same as escapeHtml, but also swaps the
 * circled-M Mass symbol (Ⓜ, U+24C2) - which the body fonts don't include and
 * which fell back to a stray "@"-looking glyph - for a styled inline circled M
 * that renders on any font, in the app and in print. Use for any faction rule,
 * HVP rule, or tutorial text; do NOT use for <textarea> values (the raw symbol
 * must survive a round-trip there).
 */
export function ruleText(s: string): string {
  return escapeHtml(s).replace(/Ⓜ/g, '<span class="mass-inline" role="img" aria-label="Mass">M</span>');
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
