import type { AllianceSpecies } from "../src/types.ts";
import { store } from "./state.ts";
import * as actions from "./actions.ts";
import { renderApp } from "./render.ts";
import "./style.css";

const rootEl = document.getElementById("app");
if (!rootEl) throw new Error("Missing #app root element.");
const root: HTMLElement = rootEl;

function paint(): void {
  // Full re-render on every state change. Preserve focus/selection across it,
  // otherwise typing in the fleet-name field loses focus on every keystroke.
  const active = document.activeElement;
  const activeId = active instanceof HTMLElement && active.id ? active.id : null;
  const selectable = active instanceof HTMLInputElement ? active : null;
  const selStart = selectable?.selectionStart ?? null;
  const selEnd = selectable?.selectionEnd ?? null;

  renderApp(root, store.getState());

  if (activeId) {
    const restored = document.getElementById(activeId);
    if (restored instanceof HTMLElement) {
      restored.focus();
      if (restored instanceof HTMLInputElement && selStart !== null && selEnd !== null) {
        try {
          restored.setSelectionRange(selStart, selEnd);
        } catch {
          // Some input types (e.g. number) don't support selection ranges; ignore.
        }
      }
    }
  }
}

store.subscribe(paint);
paint();

root.addEventListener("click", (e) => {
  const target = (e.target as Element).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case "set-faction":
      actions.setFaction(target.dataset.factionId!);
      break;
    case "set-credits":
      actions.setCreditsLimit(Number(target.dataset.limit));
      break;
    case "add-unit":
      actions.addUnit(target.dataset.ship!);
      break;
    case "remove-unit":
      actions.removeUnit(target.dataset.unit!);
      break;
    case "unit-inc":
      actions.incrementUnit(target.dataset.unit!);
      break;
    case "unit-dec":
      actions.decrementUnit(target.dataset.unit!);
      break;
    default:
      break;
  }
});

root.addEventListener("input", (e) => {
  const target = e.target;
  if (target instanceof HTMLInputElement && target.id === "fleet-name") {
    actions.setFleetName(target.value);
  }
});

root.addEventListener("change", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;

  if (action === "toggle-hvp" && target instanceof HTMLInputElement) {
    actions.toggleHvp(target.dataset.hvp!);
  } else if (action === "set-species" && target instanceof HTMLSelectElement) {
    const val = target.value;
    actions.setUnitSpecies(target.dataset.unit!, val ? (val as AllianceSpecies) : undefined);
  } else if (action === "assign-hvp" && target instanceof HTMLSelectElement) {
    const val = target.value;
    actions.setHvpAssignment(target.dataset.hvp!, val || undefined);
  }
});
