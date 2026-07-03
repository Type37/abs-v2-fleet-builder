import type { Faction } from "../types.ts";
import { w } from "./_helpers.ts";

// The Training Fleet, Basic Training p.60-61. Used by the Combat Simulator
// (p.62) and Management Training (p.65) tutorial scenarios.
//
// Fleet composition (p.60): 1x Heavy Cruiser, 1x Frigate, 3x Corvettes,
// 3x Gunships, 3x Light Utility Ships, 3x Fighter Wings, 3x Bomber Wings.

/** Verbatim from Basic Training p.61. */
export const CARRYING_SQUADRONS_TEXT =
  "When you deploy your Heavy Cruiser or Frigate, you can load units of Fighters and Bombers into them, or you can deploy those units directly. A unit can carry a number of Squadrons up to twice its Combined Mass, so the Heavy Cruiser can carry up to six Fighter or Bomber Wings; the Frigate can carry four; and a unit of three Corvettes can carry up to six.";

export const TRAINING_FLEET: Faction = {
  id: "training-fleet",
  name: "Training Fleet",
  era: "Armageddon",
  // "During Basic Training, your Initiative Value is 3D6." (p.64, p.67).
  initiative: "3D6",
  cmdTokens: "7",
  rule: {
    name: "Training Fleet",
    text: "No faction rule. The Training Fleet is the pre-set fleet used for the Basic Training tutorial scenarios (p.60): a smaller fleet than you'd normally field, so you can learn the rules with fewer units to worry about.",
  },
  // Ship stats table, p.61. Reconstruction note: in the extract the Primary
  // Weapons column was shifted upward relative to the ship rows; primaries
  // were re-matched using the identical generic human designs elsewhere in
  // the book (Galactic Credit p.148, News Inc. p.146, Junkspace p.202),
  // which corroborate every row below.
  ships: [
    { id: "fighter-wing", name: "Fighter Wing", mass: 0, thrust: 6, silhouette: 3, shields: 0,
      primary: [], auxiliary: [w("Auto Blasters", 3, "D6", 0, 6)], utilityBays: false, cost: 5 },
    { id: "bomber-wing", name: "Bomber Wing", mass: 0, thrust: 4, silhouette: 3, shields: 0,
      primary: [w("Torpedoes", 1, "D10", 6, 12)], auxiliary: [], utilityBays: false, cost: 8 },
    { id: "light-utility-ship", name: "Light Utility Ship", mass: 1, thrust: 5, silhouette: 4, shields: 1,
      primary: [w("Light Blasters", 1, "D6", 0, 3)], auxiliary: [], utilityBays: true,
      auxiliaryUtility: true, cost: 8 },
    { id: "gunship", name: "Gunship", mass: 1, thrust: 6, silhouette: 4, shields: 1,
      primary: [w("Blasters", 2, "D6", 0, 6)], auxiliary: [w("Blasters", 2, "D6", 0, 6)],
      utilityBays: false, cost: 10 },
    { id: "corvette", name: "Corvette", mass: 2, thrust: 8, silhouette: 5, shields: 2,
      primary: [w("Turbo Blasters", 4, "D6", 0, 6)], auxiliary: [w("Blasters", 2, "D6", 0, 6)],
      utilityBays: false, cost: 15 },
    { id: "frigate", name: "Frigate", mass: 2, thrust: 5, silhouette: 6, shields: 4,
      primary: [w("Light Railguns", 2, "D8", 9, 18)], auxiliary: [w("Turbo Blasters", 4, "D6", 0, 6)],
      utilityBays: false, cost: 25 },
    { id: "heavy-cruiser", name: "Heavy Cruiser", mass: 3, thrust: 6, silhouette: 9, shields: 6,
      primary: [w("Heavy Railguns", 2, "D12", 9, 18)], auxiliary: [w("Defence Grid", 4, "D8", 0, 9)],
      utilityBays: false, cost: 62 },
  ],
  hvp: [],
};
