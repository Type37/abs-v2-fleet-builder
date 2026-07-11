import type { PilotClass, ShipClass } from "../types.ts";
import { w } from "./_helpers.ts";

// Junkspace (Solo Play) data, rules p.193-215.
//
// NOTE ON COSTS: all Junkspace ship costs are in thousands of Juran credits
// (¢k), not the billions of Galactic Universal Credits (¢bn) used everywhere
// else in the rulebook (p.202).

// ---------------------------------------------------------------------------
// Stock ship classes (p.202)
// ---------------------------------------------------------------------------

// Ship stats table p.202, confirmed against the final layout. (An earlier
// text-only extraction drifted the class names off their stat rows and led to
// the Light Freighter and Gunship being entered swapped; the printed table has
// Light Freighter as the Thrust 6 / dual-Blasters row and Gunship as the
// Thrust 4 / single-Laser-Cannon row, corrected below.)
export const JUNKSPACE_SHIPS: ShipClass[] = [
  { id: "recon-ship", name: "Recon Ship", mass: 0, thrust: 8, silhouette: 2, shields: 1,
    primary: [w("Light Blasters", 1, "D6", 0, 3)], auxiliary: [], utilityBays: false,
    auxiliaryFitting: "Long-Range Scanners", cost: 2 },
  { id: "starfighter", name: "Starfighter", mass: 0, thrust: 6, silhouette: 3, shields: 1,
    primary: [], auxiliary: [w("Auto Blasters", 3, "D6", 0, 6)], utilityBays: false, cost: 5 },
  { id: "bomber", name: "Bomber", mass: 0, thrust: 4, silhouette: 3, shields: 1,
    primary: [w("Torpedoes", 1, "D10", 6, 12)], auxiliary: [], utilityBays: false, cost: 8 },
  { id: "light-freighter", name: "Light Freighter", mass: 1, thrust: 6, silhouette: 4, shields: 2,
    primary: [w("Blasters", 2, "D6", 0, 6)], auxiliary: [w("Blasters", 2, "D6", 0, 6)],
    utilityBays: false, cost: 10 },
  { id: "gunship", name: "Gunship", mass: 1, thrust: 4, silhouette: 4, shields: 2,
    primary: [], auxiliary: [w("Laser Cannon", 2, "D8", 0, 6)], utilityBays: false, cost: 10 },
  { id: "corvette", name: "Corvette", mass: 2, thrust: 8, silhouette: 5, shields: 3,
    primary: [w("Turbo Blasters", 4, "D6", 0, 6)], auxiliary: [w("Blasters", 2, "D6", 0, 6)],
    utilityBays: false, cost: 15 },
  { id: "frigate", name: "Frigate", mass: 2, thrust: 5, silhouette: 6, shields: 4,
    primary: [w("Light Railguns", 2, "D8", 9, 18)], auxiliary: [w("Turbo Blasters", 4, "D6", 0, 6)],
    utilityBays: false, cost: 25 },
];

/** Long-Range Scan action granted by the Recon Ship's Long-Range Scanners (p.202). */
export const LONG_RANGE_SCAN_TEXT =
  "Long-Range Scan (action): Make an Initiative Test. If you succeed, peek at the number on one Blip marker within 12\" without revealing it.";

// ---------------------------------------------------------------------------
// Pilot classes and starting perks (p.202)
// ---------------------------------------------------------------------------

export interface PilotPerk {
  class: PilotClass;
  perkName: string;
  text: string;
}

export const PILOT_PERKS: PilotPerk[] = [
  { class: "Gunner", perkName: "Hot Shot",
    text: "A ship with a Gunner as a pilot can re-roll one attack die in each salvo." },
  { class: "Hauler", perkName: "Tough",
    text: "A ship with a Hauler as a pilot ignores the first damage received from each salvo." },
  // Transcribed verbatim: "Hauler" here is an obvious typo in the source book,
  // this is the Junker starting perk and should read "Junker".
  { class: "Junker", perkName: "Smartass",
    text: "A ship with a Hauler as a pilot rolls two extra dice when making an Initiative Check as part of a Scan action." },
];

// ---------------------------------------------------------------------------
// Outfit building and campaign parameters (p.195, p.201)
// ---------------------------------------------------------------------------

/** "You get ¢30k with which to buy ships" (p.201). In ¢k. */
export const OUTFIT_BUDGET_K = 30;

/** "you can buy up to a maximum of 5 ships" (p.201). */
export const OUTFIT_MAX_SHIPS = 5;

/** "You start the campaign with a Debt of ¢30k." (p.201). In ¢k. */
export const STARTING_DEBT_K = 30;

/** "If you clear your debt within 8 games, you have won the campaign." (p.201). */
export const DEBT_CLEAR_GAMES = 8;

/** "At the start of the game, your Alert Level is 1." (p.195). */
export const ALERT_START = 1;

/** "If you have less than ¢25k Debt remaining, the Alert Level starts the game at 2." (p.195). */
export const ALERT_START_LOW_DEBT = 2;

/** Debt threshold (in ¢k) below which the Alert Level starts at 2 (p.195). */
export const LOW_DEBT_THRESHOLD_K = 25;

/** "If you have cleared your Debt completely, the Alert Level starts at 3." (p.195). */
export const ALERT_START_DEBT_CLEARED = 3;
