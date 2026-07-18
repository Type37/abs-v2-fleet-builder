import type { ShipClass, Weapon } from "../src/types.ts";
import { DAMAGE_BY_DIE } from "../src/types.ts";
import { creditsGlyph } from "./icons.ts";

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

/**
 * A credits figure for display: the credits mark followed by the amount. Main
 * (fleet) modes only - solo money is ¢k and keeps the plain cent sign.
 * Returns markup, so use creditsText() anywhere the result is not HTML.
 */
export function credits(n: number): string {
  return `${creditsGlyph(12)}${n}bn`;
}

/** The same figure as plain text, for exports, attributes and clipboard copy. */
export function creditsText(n: number): string {
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
  // A circled M as inline SVG, not a bordered text box: the SVG text is centred
  // exactly (text-anchor + dominant-baseline), which the CSS box could never do
  // reliably because it centres the font em-box, not the visible M.
  const mass =
    '<svg class="mass-inline" viewBox="0 0 24 24" role="img" aria-label="Mass">' +
    '<circle cx="12" cy="12" r="10.4" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<text x="12" y="12" text-anchor="middle" dominant-baseline="central">M</text></svg>';
  return escapeHtml(s).replace(/Ⓜ/g, mass);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
