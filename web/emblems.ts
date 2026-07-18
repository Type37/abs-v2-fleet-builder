// The emblem image library. Every image dropped into web/emblems/ is discovered
// at build time, hashed by Vite, and offered in the picker. Sub-folders become
// categories; loose files sit under "General".

import { escapeHtml } from "./format.ts";
import { icon } from "./icons.ts";

const urls = import.meta.glob("./emblems/**/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export interface LibraryIcon {
  /** Stable id: the path relative to web/emblems, e.g. "vg/WF/foo.png". */
  id: string;
  /** Hashed, build-safe URL to the asset. */
  url: string;
  category: string;
  label: string;
}

function titleCase(s: string): string {
  return s.replace(/[_\-.]+/g, " ").replace(/\s+/g, " ").trim();
}

export const ICON_LIBRARY: LibraryIcon[] = Object.entries(urls)
  .map(([path, url]) => {
    const rel = path.replace(/^\.\/emblems\//, "");
    const parts = rel.split("/");
    const category = parts.length > 1 ? (parts[0] ?? "General") : "General";
    const file = parts[parts.length - 1] ?? rel;
    return { id: rel, url, category, label: titleCase(file.replace(/\.[^.]+$/, "")) };
  })
  .sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));

const BY_ID = new Map(ICON_LIBRARY.map((i) => [i.id, i]));

/** Resolve a stored library id to its current hashed URL, or undefined. */
export function libraryUrl(id: string | undefined): string | undefined {
  return id ? BY_ID.get(id)?.url : undefined;
}

export const ICON_CATEGORIES: string[] = [...new Set(ICON_LIBRARY.map((i) => i.category))].sort((a, b) =>
  a === "abs" ? -1 : b === "abs" ? 1 : a === "General" ? -1 : b === "General" ? 1 : a.localeCompare(b),
);

/** A random library icon id (Math.random is fine in app code). */
export function randomIconId(): string | undefined {
  if (ICON_LIBRARY.length === 0) return undefined;
  return ICON_LIBRARY[Math.floor(Math.random() * ICON_LIBRARY.length)]!.id;
}

/**
 * Shared markup for the icon-library controls: a Random button and a
 * categorised picker. Action names are passed so fleets, outfits, and custom
 * factions can reuse it.
 */
/** One flat, sorted grid of every icon (no category headers), for embedding.
 * Each tile carries its origin folder as data-cat so styling can treat sets
 * differently (e.g. keep the colour on the "vg" insignia). */
export function iconLibraryGrid(actLib: string, currentLib?: string, activeCat?: string): string {
  const items = [...ICON_LIBRARY]
    .filter((i) => !activeCat || activeCat === "all" || i.category === activeCat)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(
      // No title tooltip - the mouseover label was noise. alt stays for a11y.
      (i) =>
        `<button class="lib-icon ${currentLib === i.id ? "selected" : ""}" data-cat="${escapeHtml(i.category)}" data-action="${actLib}" data-lib="${escapeHtml(i.id)}"><img loading="lazy" src="${i.url}" alt="${escapeHtml(i.label)}" /></button>`,
    )
    .join("");
  return items ? `<div class="lib-grid lib-grid-blob">${items}</div>` : '<p class="muted">No icons in this folder.</p>';
}

/** A human label for a category folder (the folders are the emblem sub-folders). */
export function categoryLabel(cat: string): string {
  if (cat === "abs") return "A Billion Suns";
  if (cat === "vg") return "Video Games";
  if (cat === "General") return "General";
  return titleCase(cat);
}

export function iconLibraryControls(actLib: string, actRandom: string, currentLib?: string): string {
  const cats = iconLibraryGrid(actLib, currentLib);
  return `
    <button class="emblem-choice" data-action="${actRandom}" title="Random icon from the library">${icon("shuffle", 18)}</button>
    <details class="icon-library">
      <summary class="emblem-choice lib-open" title="Choose from the icon library">${icon("grid", 18)}</summary>
      <div class="lib-body">${cats || '<p class="muted">No icons in the library yet.</p>'}</div>
    </details>`;
}

/**
 * The full emblem picker: a large current-emblem preview beside clearly-labelled
 * actions - Upload, Library (opens the grid), Random, and Remove. Every action
 * pairs an icon with a word, so "upload your own" versus "choose from the
 * library" reads at a glance instead of a cramped row of identical squares.
 * `previewHtml` is the caller's rendered current emblem (or a placeholder).
 */
export function emblemPickerUI(opts: {
  previewHtml: string;
  uploadAction: string;
  libAction: string;
  randomAction: string;
  clearAction: string;
  hasImage: boolean;
  currentLib?: string;
}): string {
  const grid = iconLibraryGrid(opts.libAction, opts.currentLib);
  return `
    <div class="emblem-pick">
      <span class="emblem-pick-preview ${opts.hasImage ? "has-img" : ""}">${opts.previewHtml}</span>
      <div class="emblem-pick-actions">
        <label class="ep-btn" title="Upload your own image">${icon("upload", 16)}<span>Upload</span>
          <input type="file" accept="image/*" data-action="${opts.uploadAction}" hidden /></label>
        <details class="ep-lib">
          <summary class="ep-btn" title="Choose from the icon library">${icon("grid", 16)}<span>Library</span></summary>
          <div class="ep-lib-panel">
            <div class="ep-lib-head">
              <span class="ep-lib-title">Emblem library</span>
              <button type="button" class="ep-lib-close" data-action="close-popover" aria-label="Close">${icon("close", 16)}</button>
            </div>
            <div class="ep-lib-scroll">${grid || '<p class="muted">No icons in the library yet.</p>'}</div>
          </div>
        </details>
        <button type="button" class="ep-btn" data-action="${opts.randomAction}" title="Pick a random icon">${icon("shuffle", 16)}<span>Random</span></button>
        ${opts.hasImage ? `<button type="button" class="ep-btn danger" data-action="${opts.clearAction}" title="Remove the emblem">${icon("close", 16)}<span>Remove</span></button>` : ""}
      </div>
    </div>`;
}
