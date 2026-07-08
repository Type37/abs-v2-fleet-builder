# A Billion Suns 2e Shipyard

A fleet and shipyard builder for **A Billion Suns, 2nd Edition** (Mike Hutchinson / Osprey Games).

**Live:** https://type37.github.io/a-billion-suns-shipyard/

Pick an era, pick a faction, build a legal list (or fill a Shipyard), give it an emblem, then print or share it. The app is a static site — everything runs in the browser and lists are stored locally.

## Features

- **All three eras**, with the builder shape each one uses:
  - **Armageddon** and **Age of Unity** — pre-built Fleet Lists (units + High-Value Personnel to a credits limit).
  - **Hypergrowth** — a Shipyard: buy a pool of ships up front, requisition units in play.
- **Twelve factions**, transcribed from the book and auto-discovered from data files:
  - *Hypergrowth:* Heavy Industries, MegaMart, News Inc, Galactic Credit.
  - *Age of Unity:* The Unity, The Ordinate, The Discord, Golem Mega-Systems.
  - *Armageddon:* Vyke, AEGIS, Gen Ω, Alliance.
- **Live rules validation** — the builder flags over-budget lists, illegal unit sizes, HVP-count and assignment problems, and the other list-building constraints as you edit.
- **Custom faction Foundry** — define your own faction; it merges on top of the built-in catalogue at runtime.
- **Emblems** — a set of built-in vector marks per faction, plus colour and upload options.
- **Learn to play** — the rulebook's tutorial fleets (Combat Simulator, Management Training) load as ready-made lists, with guided tours.
- **Fleet notes**, a **printable roster**, **share links**, and a bundled **Quick Reference PDF**.

## Running locally

Requires Node ≥ 22.6.

```bash
npm install       # dev-only deps: Vite + TypeScript
npm run dev       # dev server at http://localhost:5731
npm run build     # production build to dist/
npm run preview   # serve the built site
```

The rules engine has its own test suite (no build step — TypeScript runs natively via type-stripping):

```bash
npm test          # validation + data-integrity suites
npm run typecheck # optional type-check
```

## Layout

```
src/                    Rules engine (framework-free, tested)
  types.ts              Domain model (Era, GameMode, Faction, Fleet, Shipyard, ...)
  validation.ts         validateFleet() — the list-building rules
  data/
    factions/           The 12 faction rosters (auto-discovered by the web app)
    generic-hvp.ts      Generic High-Value Personnel
    training-fleet.ts   Tutorial fleets
    junkspace*.ts       Solo / Junkspace content
    index.ts            Catalog registry
test/
  data.test.ts          Roster data-integrity checks
  validation.test.ts    Rule-by-rule validation coverage

web/                    The browser app (Vite root)
  index.html main.ts    Entry point
  render.ts state.ts    View + app state
  catalog.ts            Build-time faction discovery + era ordering
  emblems/ *.ts         Emblems, seed factions, sharing, tours, changelog
```

The in-app changelog (`web/changelog.ts`, shown at `#/changelog`) tracks what's changed release to release.

## Deploying

GitHub Pages serves the site from the **`gh-pages` branch** (legacy Pages build, not Actions). Source lives on `main`; `dist/` is gitignored. To publish a new build:

```bash
npm run build
cd dist
touch .nojekyll
git init && git checkout -b gh-pages
git add -A && git commit -m "Deploy"
git push -f https://github.com/Type37/a-billion-suns-shipyard.git gh-pages
rm -rf .git        # remove the nested repo
```

`base: "./"` in `vite.config.ts` keeps asset paths relative, so the site works from the Pages subpath without extra config. The live CDN can take a few minutes to flip after a push.

---

*A Billion Suns is © Mike Hutchinson, published by Osprey Games. This is an unofficial fan-made tool. Fleet builder by [WarLore](https://linktr.ee/warlore).*
