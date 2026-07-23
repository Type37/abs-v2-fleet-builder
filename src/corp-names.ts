// Corporation-name generator for Hypergrowth companies.
//
// Ported straight from the tabletop "Corporation Generator"
// (jetwong.neocities.org/rpgs/corp-generator): a two-part d12 x d12 name, a
// prefix rolled against a suffix, so a Hypergrowth megacorp reads like
// "Gene Labs", "Hax Industrial", or "Progen Wave". 12 x 12 = 144 combinations,
// deliberately grim and faux-corporate to match the era's satire.

/** Part one: the d12 prefix roll. */
export const CORP_NAME_PART_ONE: readonly string[] = [
  "Cy", "Kifo", "Fosse", "Ütga", "Crown's", "Galg",
  "Smrt", "Gene", "Pereo", "Progen", "Häx", "Futura",
];

/** Part two: the d12 suffix roll. */
export const CORP_NAME_PART_TWO: readonly string[] = [
  "Futures", "Tech", "Inc", "Industrial", "Labs", "Nero",
  "Mgmt", "Svärta", "Wave", "Institute", "Division", "Malum",
];

function roll(list: readonly string[]): string {
  return list[Math.floor(Math.random() * list.length)]!;
}

/**
 * A random corporation name: one prefix and one suffix, e.g. "Gene Labs" or
 * "Häx Industrial". Two independent d12 rolls, exactly as the paper generator.
 */
export function randomCorpName(): string {
  return `${roll(CORP_NAME_PART_ONE)} ${roll(CORP_NAME_PART_TWO)}`;
}
