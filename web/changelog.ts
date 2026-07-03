// In-app changelog. Newest first. Full sentences, no shorthand.

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.2.0",
    date: "2026-07-02",
    title: "The full register",
    items: [
      "Complete redesign in the International Typographic Style: white ground, the two NASA insignia colours (blue and rocket red), Libre Franklin for the interface and Georgia for long rules text. Libre Franklin is an open revival of Morris Fuller Benton's Franklin Gothic, the American institutional grotesque of the space age; Georgia is Matthew Carter's serif, drawn for on-screen readability.",
      "New home port: every fleet you build is saved in this browser automatically and listed there, with duplicate, share, and delete controls.",
      "The builder now shows the ship catalogue on the left and your living roster on the right, always visible while you work.",
      "Everything can be renamed: the fleet, each unit, each individual ship, and each member of your High-Value Personnel.",
      "Every fleet gets an emblem, chosen from a set of geometric marks, and every unit carries a hull silhouette matched to its Mass class.",
      "Free Play mode unlocks everything: mix ships from any faction, set any credits limit, and build outside the rules checks entirely.",
      "The Faction Foundry lets you create your own factions: name, era, faction rule, full ship classes with weapons, and High-Value Personnel.",
      "Share links now carry names, emblems, and custom factions, so the person opening your link sees exactly what you built.",
      "A dedicated print document, designed from the conventions of the best printed army lists: full rules text on the sheet so the rulebook can stay closed, black on white with hairline tables, unit blocks that never split across pages, and a four-round score grid matched to the game's fixed length.",
      "All twelve factions from the Second Edition rulebook are included as their data passes verification, together with the rule that any faction may be fielded in any era.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-01",
    title: "First light",
    items: [
      "Armageddon era fleet building with the four factions of the Unhuman War: The Vyke, AEGIS, Gen Omega, and The Alliance of Non-Human Worlds.",
      "The full Armageddon validation engine: credits limits, unit sizes, the Mass 3 single-ship rule, Alliance species declarations, and High-Value Personnel selection and assignment.",
      "Share links and a first printable roster.",
    ],
  },
];
