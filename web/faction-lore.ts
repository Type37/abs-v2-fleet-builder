// One original sentence per faction summarising their aesthetic and key
// mechanical hook. Kept out of src/ so the rules engine stays flavour-free.

export interface FactionLore {
  summary: string;
}

export const FACTION_LORE: Record<string, FactionLore> = {
  "heavy-industries": {
    summary:
      "Slow industrial leviathans that are nearly impossible to dislodge from objectives — position carefully and build defence in depth.",
  },
  megamart: {
    summary:
      "Fragile freighter fleets that outmanoeuvre rather than outgun — high speed and movement tricks put you exactly where the enemy doesn't want you.",
  },
  "news-inc": {
    summary:
      "Media manipulators who drain enemy command resources and disable their tools — stay close and keep the pressure on.",
  },
  "galactic-credit": {
    summary:
      "A small, expensive fleet that bends the rules with the galaxy's most powerful (and devious) personnel.",
  },
  "the-unity": {
    summary:
      "Massive capital ships backed by endless starfighter wings — field enough squadrons to fully exploit your numbers.",
  },
  "the-ordinate": {
    summary:
      "Close-range passive fire specialists who punish enemies for moving — plan ahead, as your power depends on catching the enemy in your arc.",
  },
  "the-discord": {
    summary:
      "Elite guerrillas with powerful squadrons and strong control tools — strike fast and hard where the enemy is weakest.",
  },
  "golem-mega-systems": {
    summary:
      "A drone swarm that evolves mid-battle: ships lost spawn more drones, and your HVP choice shapes the whole character of your machine-mind.",
  },
  vyke: {
    summary:
      "Aggressive alien brawlers who shut down enemy passive fire at close range — the harder you press, the less the enemy can shoot back.",
  },
  aegis: {
    summary:
      "An elite AI fleet that shares combat protocols between units — concentrate into an overwhelming hammer or split into mixed task forces.",
  },
  "gen-omega": {
    summary:
      "Suicidal guerrillas who hit harder as they take damage — strike from the void, fight dirty, and make every casualty count.",
  },
  alliance: {
    summary:
      "A powerful but fractious coalition of alien species — field many ships and exploit the chaos when common cause is found.",
  },
};
