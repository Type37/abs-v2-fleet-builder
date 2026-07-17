// Each faction's slogan: the epigraph that heads its rulebook entry, verbatim.
// Kept out of src/ so the rules engine stays flavour-free; looked up by faction
// id at render time.

export interface FactionLore {
  tagline: string;
}

export const FACTION_LORE: Record<string, FactionLore> = {
  "heavy-industries": {
    tagline: "We use penal labour because mining is really dangerous.",
  },
  megamart: {
    tagline: "If you can imagine it, we can deliver it (before you reconsider it).",
  },
  "news-inc": {
    tagline: "Tonight, on This Is Your Galaxy...",
  },
  "galactic-credit": {
    tagline: "We succeed when you succeed. Take out a Galactic Credit loan today.",
  },
  "the-unity": {
    tagline: "In Unity, there is strength. Join the Peacekeepers today and keep the galaxy great!",
  },
  "the-ordinate": {
    tagline: "Your actions have been anticipated by the Registrar. Our victory is pre-ordained.",
  },
  "the-discord": {
    tagline: "To ignore advice. To be wasteful. To err. This is our right. And we will die for it.",
  },
  "golem-mega-systems": {
    tagline: "> Construction fleet delta 8 approaching target. Initialising drone swarms.",
  },
  vyke: {
    tagline: "There is no negotiation with the Vyke. We would destroy them utterly, or be annihilated.",
  },
  aegis: {
    tagline: "> Situational analysis... Updating capability matrix... Sorting by threat index... Acquiring targets...",
  },
  "gen-omega": {
    tagline: "Our vile offspring are our end. There's nothing on the other side of this war. Not for the last generation.",
  },
  alliance: {
    tagline: "Your Unity is built on forced labour, stolen lives and broken worlds. It is brittle, and we will smash it.",
  },
};
