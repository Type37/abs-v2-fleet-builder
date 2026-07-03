import type { Faction } from "../../types.ts";
import { w } from "../_helpers.ts";

// Megamart, Hypergrowth faction (rules p.144-145).
// Header reads "MEGAMART"; the strengths text uses "Megamart" (the flavour
// text once styles the company as "MegaMart", but "Megamart" is used here).
export const MEGAMART: Faction = {
  id: "megamart",
  name: "Megamart",
  era: "Hypergrowth",
  initiative: "3D6",
  cmdTokens: "7",
  rule: {
    name: "Time Is Money",
    text: "Each unit in this fleet can use the Power to Engines command for 0 CMD once per Round.",
  },
  ships: [
    { id: "delivery-drone-wing", name: "Delivery Drone Wing", mass: 0, thrust: 8, silhouette: 2, shields: 0,
      primary: [w("Light Blasters", 1, "D6", 0, 3)], auxiliary: [], utilityBays: false, cost: 2 },
    { id: "fighter-wing", name: "Fighter Wing", mass: 0, thrust: 6, silhouette: 3, shields: 0,
      primary: [], auxiliary: [w("Blasters", 2, "D6", 0, 6)], utilityBays: false, cost: 5 },
    { id: "bomber-wing", name: "Bomber Wing", mass: 0, thrust: 4, silhouette: 3, shields: 0,
      primary: [w("Torpedoes", 1, "D10", 6, 12)], auxiliary: [], utilityBays: false, cost: 7 },
    { id: "star-cutter", name: "Star Cutter", mass: 1, thrust: 10, silhouette: 3, shields: 0,
      primary: [w("Blasters", 2, "D6", 0, 6)], auxiliary: [w("Blasters", 2, "D6", 0, 6)], utilityBays: false, cost: 8 },
    { id: "ranger-dropship", name: "Ranger Dropship", mass: 1, thrust: 6, silhouette: 4, shields: 1,
      primary: [w("Laser Cannon", 2, "D8", 0, 9)], auxiliary: [], utilityBays: true, auxiliaryUtility: true, cost: 10 },
    { id: "prime-corvette", name: "Prime Corvette", mass: 2, thrust: 8, silhouette: 5, shields: 2,
      primary: [], auxiliary: [w("Turbo Blasters", 4, "D6", 0, 6)], utilityBays: false, cost: 18 },
    { id: "logistics-monitor", name: "Logistics Monitor", mass: 2, thrust: 7, silhouette: 6, shields: 3,
      primary: [w("Particle Beams", 2, "D10", 12, 24)], auxiliary: [w("Light Blasters", 2, "D6", 0, 3)], utilityBays: false, cost: 25 },
    { id: "delivery-cruiser", name: "Delivery Cruiser", mass: 2, thrust: 6, silhouette: 7, shields: 4,
      primary: [w("Laser Cannon", 2, "D8", 0, 9)], auxiliary: [], utilityBays: true, auxiliaryUtility: true, cost: 20 },
    { id: "titan-mallship", name: "Titan Mallship", mass: 3, thrust: 6, silhouette: 9, shields: 6,
      primary: [w("Cruise Missiles", 4, "D10", 18, 36)], auxiliary: [w("Defence Grid", 4, "D8", 0, 9)], utilityBays: false, cost: 70 },
  ],
  hvp: [
    { id: "chief-of-logistics", name: "Chief of Logistics",
      rule: "This fleet has access to the following Command: Priority Delivery (1 CMD): When it is your turn to activate a unit, you may instead Jump In a unit, as if it was the Jump Phase." },
    { id: "chief-operational-officer", name: "Chief Operational Officer",
      rule: "Ships in this fleet may deploy 12\" from Jump Points, rather than 6\"." },
    { id: "drone-conductor", name: "Drone Conductor",
      rule: "Ships in this fleet may take a Scramble Wings action immediately after jumping." },
    { id: "dropfleet-coordinator", name: "Dropfleet Co-ordinator",
      rule: "Units in this fleet increase their Unit Coherence to 9\"." },
    { id: "head-of-customer-empathy", name: "Head of Customer Empathy",
      rule: "Ships in this battlegroup gain +2\" Thrust." },
    { id: "head-of-quality-control", name: "Head of Quality Control",
      rule: "Ships in this battlegroup may take a free Scan action in addition to any other action during their Action Step." },
    { id: "veteran-navigator", name: "Veteran Navigator",
      rule: "Units in this battlegroup can Jump Hop using enemy Jump Points. (All in-play Jump Points count as connected.)" },
  ],
  playstyle: "Fast units on a tight schedule, zipping around the play area with movement tricks to be exactly where the enemy doesn't want you. Mostly fragile ships with weak shields and slight silhouettes, so rely on tactical flexibility in place of raw power.",
};
