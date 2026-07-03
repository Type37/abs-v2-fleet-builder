import type { Faction, GameMode, Mass, Weapon } from "../src/types.ts";
import { findFaction, isCustom } from "./catalog.ts";
import { newId, persistCustomFactions, persistLists } from "./storage.ts";
import { createList, nextUnitIdFor, routeHash, store, updateFleet, updateList } from "./state.ts";
import { shareUrl } from "./share.ts";

// All interaction goes through delegated listeners on #app. Elements declare
// intent with data-action attributes; this module mutates state and persists.

let toastTimer: ReturnType<typeof setTimeout> | undefined;

function showToast(message: string): void {
  if (toastTimer) clearTimeout(toastTimer);
  store.setState((s) => ({ ...s, ui: { ...s.ui, toast: message } }));
  toastTimer = setTimeout(() => {
    store.setState((s) => ({ ...s, ui: { ...s.ui, toast: undefined } }));
  }, 2200);
}

function currentListId(): string | null {
  const r = store.getState().route;
  return r.view === "builder" || r.view === "print" ? r.listId : null;
}

function editFaction(factionId: string, fn: (f: Faction) => Faction): void {
  store.setState((s) => {
    const customFactions = s.customFactions.map((f) => (f.id === factionId ? fn(f) : f));
    persistCustomFactions(customFactions);
    return { ...s, customFactions };
  });
}

function currentFoundryId(): string | null {
  const r = store.getState().route;
  return r.view === "foundry" && r.factionId ? r.factionId : null;
}

function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Click handling
// ---------------------------------------------------------------------------

function handleClick(e: MouseEvent): void {
  const target = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset["action"];
  const state = store.getState();

  switch (action) {
    case "new-list": {
      const mode = (target.dataset["mode"] ?? "armageddon") as GameMode;
      const factionId = target.dataset["faction"] ?? "vyke";
      const freePlay = target.dataset["freeplay"] === "1";
      const list = createList(mode, factionId, freePlay);
      store.setState((s) => {
        const lists = [...s.lists, list];
        persistLists(lists);
        return { ...s, lists };
      });
      location.hash = routeHash({ view: "builder", listId: list.id });
      break;
    }
    case "duplicate-list": {
      const id = target.dataset["id"];
      const source = state.lists.find((l) => l.id === id);
      if (!source) return;
      const copy = structuredClone(source);
      copy.id = newId("fl");
      copy.fleet.name = source.fleet.name ? `${source.fleet.name} (copy)` : "";
      copy.createdAt = new Date().toISOString();
      copy.updatedAt = copy.createdAt;
      store.setState((s) => {
        const lists = [...s.lists, copy];
        persistLists(lists);
        return { ...s, lists };
      });
      showToast("Fleet duplicated.");
      break;
    }
    case "delete-list": {
      const id = target.dataset["id"];
      const doomed = state.lists.find((l) => l.id === id);
      if (!doomed) return;
      if (!confirm(`Delete "${doomed.fleet.name || "Unnamed fleet"}"? This cannot be undone.`)) return;
      store.setState((s) => {
        const lists = s.lists.filter((l) => l.id !== id);
        persistLists(lists);
        return { ...s, lists };
      });
      if (currentListId() === id) location.hash = "#/";
      break;
    }
    case "share-list": {
      const id = target.dataset["id"];
      const list = state.lists.find((l) => l.id === id);
      if (!list) return;
      const cf = isCustom(list.fleet.factionId, state.customFactions)
        ? findFaction(list.fleet.factionId, state.customFactions)
        : undefined;
      const url = shareUrl(list, cf);
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("Share link copied to the clipboard."))
        .catch(() => {
          prompt("Copy this link:", url);
        });
      break;
    }
    case "set-emblem": {
      const id = currentListId();
      const emblemId = target.dataset["emblem"];
      if (!id || !emblemId) return;
      store.setState((s) => updateList(s, id, (l) => ({ ...l, emblem: emblemId })));
      break;
    }
    case "set-limit": {
      const id = currentListId();
      const limit = Number(target.dataset["limit"]);
      if (!id || !Number.isFinite(limit)) return;
      store.setState((s) => updateFleet(s, id, (f) => ({ ...f, creditsLimit: limit })));
      break;
    }
    case "set-faction": {
      const id = currentListId();
      const factionId = target.dataset["faction"];
      if (!id || !factionId) return;
      // Units and personnel from the old faction would no longer resolve; the
      // inspector would flag every one. A faction change starts the list clean.
      const list = store.getState().lists.find((l) => l.id === id);
      if (list && (list.fleet.units.length > 0 || list.fleet.hvp.length > 0)) {
        if (!confirm("Changing faction clears the units and personnel in this list. Continue?")) return;
      }
      store.setState((s) => updateFleet(s, id, (f) => ({ ...f, factionId, units: [], hvp: [] })));
      break;
    }
    case "add-unit": {
      const id = currentListId();
      const shipId = target.dataset["ship"];
      if (!id || !shipId) return;
      store.setState((s) =>
        updateFleet(s, id, (f) => ({
          ...f,
          units: [...f.units, { id: nextUnitIdFor(f), shipClassId: shipId, count: 1 }],
        })),
      );
      break;
    }
    case "remove-unit": {
      const id = currentListId();
      const unitId = target.dataset["unit"];
      if (!id || !unitId) return;
      store.setState((s) =>
        updateFleet(s, id, (f) => ({
          ...f,
          units: f.units.filter((u) => u.id !== unitId),
          hvp: f.hvp.map((h) => (h.assignedUnitId === unitId ? { ...h, assignedUnitId: undefined } : h)),
        })),
      );
      break;
    }
    case "unit-count": {
      const id = currentListId();
      const unitId = target.dataset["unit"];
      const delta = Number(target.dataset["delta"]);
      if (!id || !unitId || !Number.isFinite(delta)) return;
      store.setState((s) =>
        updateFleet(s, id, (f) => ({
          ...f,
          units: f.units.map((u) => {
            if (u.id !== unitId) return u;
            const count = Math.max(1, u.count + delta);
            const shipNames = u.shipNames ? u.shipNames.slice(0, count) : undefined;
            return { ...u, count, ...(shipNames ? { shipNames } : {}) };
          }),
        })),
      );
      break;
    }
    case "toggle-ship-names": {
      const unitId = target.dataset["unit"];
      store.setState((s) => ({
        ...s,
        ui: { ...s.ui, openShipNames: s.ui.openShipNames === unitId ? undefined : unitId },
      }));
      break;
    }
    case "add-hvp": {
      const id = currentListId();
      const hvpId = target.dataset["hvp"];
      if (!id || !hvpId) return;
      store.setState((s) => updateFleet(s, id, (f) => ({ ...f, hvp: [...f.hvp, { hvpId }] })));
      break;
    }
    case "remove-hvp": {
      const id = currentListId();
      const index = Number(target.dataset["index"]);
      if (!id || !Number.isInteger(index)) return;
      store.setState((s) => updateFleet(s, id, (f) => ({ ...f, hvp: f.hvp.filter((_, i) => i !== index) })));
      break;
    }
    case "do-print": {
      window.print();
      break;
    }

    // ---- Foundry ----------------------------------------------------------
    case "new-faction": {
      const faction: Faction = {
        id: newId("cf"),
        name: "New Faction",
        era: "Armageddon",
        initiative: "3D6",
        cmdTokens: "5",
        rule: { name: "Faction rule", text: "" },
        ships: [],
        hvp: [],
      };
      store.setState((s) => {
        const customFactions = [...s.customFactions, faction];
        persistCustomFactions(customFactions);
        return { ...s, customFactions };
      });
      location.hash = routeHash({ view: "foundry", factionId: faction.id });
      break;
    }
    case "delete-faction": {
      const id = target.dataset["id"];
      const doomed = state.customFactions.find((f) => f.id === id);
      if (!doomed) return;
      if (!confirm(`Delete the faction "${doomed.name}"? Lists that use it will stop resolving.`)) return;
      store.setState((s) => {
        const customFactions = s.customFactions.filter((f) => f.id !== id);
        persistCustomFactions(customFactions);
        return { ...s, customFactions };
      });
      break;
    }
    case "export-faction": {
      const id = target.dataset["id"];
      const faction = state.customFactions.find((f) => f.id === id);
      if (!faction) return;
      downloadJson(`${faction.name.toLowerCase().replace(/\s+/g, "-")}.faction.json`, faction);
      break;
    }
    case "cf-ship-add": {
      const fid = currentFoundryId();
      if (!fid) return;
      editFaction(fid, (f) => ({
        ...f,
        ships: [
          ...f.ships,
          {
            id: newId("sh"),
            name: "New ship class",
            mass: 0 as Mass,
            thrust: 6,
            silhouette: 3,
            shields: 0,
            primary: [],
            auxiliary: [],
            utilityBays: false,
            cost: 5,
          },
        ],
      }));
      break;
    }
    case "cf-ship-remove": {
      const fid = currentFoundryId();
      const si = Number(target.dataset["ship"]);
      if (!fid || !Number.isInteger(si)) return;
      editFaction(fid, (f) => ({ ...f, ships: f.ships.filter((_, i) => i !== si) }));
      break;
    }
    case "cf-weapon-add": {
      const fid = currentFoundryId();
      const si = Number(target.dataset["ship"]);
      const slot = target.dataset["slot"] as "primary" | "auxiliary";
      if (!fid || !Number.isInteger(si)) return;
      const weapon: Weapon = { name: "New weapon", count: 1, die: "D6", rangeMin: 0, rangeMax: 6 };
      editFaction(fid, (f) => ({
        ...f,
        ships: f.ships.map((s, i) => (i === si ? { ...s, [slot]: [...s[slot], weapon] } : s)),
      }));
      break;
    }
    case "cf-weapon-remove": {
      const fid = currentFoundryId();
      const si = Number(target.dataset["ship"]);
      const wi = Number(target.dataset["index"]);
      const slot = target.dataset["slot"] as "primary" | "auxiliary";
      if (!fid || !Number.isInteger(si) || !Number.isInteger(wi)) return;
      editFaction(fid, (f) => ({
        ...f,
        ships: f.ships.map((s, i) => (i === si ? { ...s, [slot]: s[slot].filter((_, j) => j !== wi) } : s)),
      }));
      break;
    }
    case "cf-hvp-add": {
      const fid = currentFoundryId();
      if (!fid) return;
      editFaction(fid, (f) => ({ ...f, hvp: [...f.hvp, { id: newId("hv"), name: "New person", rule: "" }] }));
      break;
    }
    case "cf-hvp-remove": {
      const fid = currentFoundryId();
      const hi = Number(target.dataset["index"]);
      if (!fid || !Number.isInteger(hi)) return;
      editFaction(fid, (f) => ({ ...f, hvp: f.hvp.filter((_, i) => i !== hi) }));
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Change handling (text fields commit on change, so typing never re-renders)
// ---------------------------------------------------------------------------

function handleChange(e: Event): void {
  const target = e.target as HTMLInputElement;
  const action = target.dataset["action"];
  if (!action) return;
  const listId = currentListId();
  const inputValue = target.value ?? "";

  switch (action) {
    case "fleet-name": {
      if (!listId) return;
      store.setState((s) => updateFleet(s, listId, (f) => ({ ...f, name: inputValue })));
      break;
    }
    case "set-limit-free": {
      if (!listId) return;
      const n = Math.max(1, Math.round(Number(inputValue) || 1));
      store.setState((s) => updateFleet(s, listId, (f) => ({ ...f, creditsLimit: n })));
      break;
    }
    case "unit-name": {
      if (!listId) return;
      const unitId = target.dataset["unit"];
      store.setState((s) =>
        updateFleet(s, listId, (f) => ({
          ...f,
          units: f.units.map((u) => (u.id === unitId ? { ...u, name: inputValue } : u)),
        })),
      );
      break;
    }
    case "ship-name": {
      if (!listId) return;
      const unitId = target.dataset["unit"];
      const index = Number(target.dataset["index"]);
      store.setState((s) =>
        updateFleet(s, listId, (f) => ({
          ...f,
          units: f.units.map((u) => {
            if (u.id !== unitId) return u;
            const shipNames = [...(u.shipNames ?? [])];
            while (shipNames.length < u.count) shipNames.push("");
            shipNames[index] = inputValue;
            return { ...u, shipNames };
          }),
        })),
      );
      break;
    }
    case "unit-species": {
      if (!listId) return;
      const unitId = target.dataset["unit"];
      const species = inputValue as "Rannari" | "Yynnx" | "Gorgronti" | "";
      store.setState((s) =>
        updateFleet(s, listId, (f) => ({
          ...f,
          units: f.units.map((u) =>
            u.id === unitId ? { ...u, species: species === "" ? undefined : species } : u,
          ),
        })),
      );
      break;
    }
    case "hvp-name": {
      if (!listId) return;
      const index = Number(target.dataset["index"]);
      store.setState((s) =>
        updateFleet(s, listId, (f) => ({
          ...f,
          hvp: f.hvp.map((h, i) => (i === index ? { ...h, customName: inputValue || undefined } : h)),
        })),
      );
      break;
    }
    case "hvp-assign": {
      if (!listId) return;
      const index = Number(target.dataset["index"]);
      store.setState((s) =>
        updateFleet(s, listId, (f) => ({
          ...f,
          hvp: f.hvp.map((h, i) => (i === index ? { ...h, assignedUnitId: inputValue || undefined } : h)),
        })),
      );
      break;
    }

    // ---- Foundry ----------------------------------------------------------
    case "cf-field": {
      const fid = currentFoundryId();
      const field = target.dataset["field"];
      if (!fid || !field) return;
      editFaction(fid, (f) => {
        switch (field) {
          case "name":
            return { ...f, name: inputValue };
          case "era":
            return { ...f, era: inputValue as Faction["era"] };
          case "initiative":
            return { ...f, initiative: inputValue };
          case "cmdTokens":
            return { ...f, cmdTokens: inputValue };
          case "ruleName":
            return { ...f, rule: { ...f.rule, name: inputValue } };
          case "ruleText":
            return { ...f, rule: { ...f.rule, text: inputValue } };
          default:
            return f;
        }
      });
      break;
    }
    case "cf-ship": {
      const fid = currentFoundryId();
      const si = Number(target.dataset["ship"]);
      const field = target.dataset["field"];
      if (!fid || !Number.isInteger(si) || !field) return;
      const checked = target.checked;
      editFaction(fid, (f) => ({
        ...f,
        ships: f.ships.map((s, i) => {
          if (i !== si) return s;
          switch (field) {
            case "name":
              return { ...s, name: inputValue };
            case "mass":
              return { ...s, mass: Number(inputValue) as Mass };
            case "thrust":
              return { ...s, thrust: Number(inputValue) || 0 };
            case "silhouette":
              return { ...s, silhouette: Number(inputValue) || 1 };
            case "shields":
              return { ...s, shields: Number(inputValue) || 0 };
            case "cost":
              return { ...s, cost: Math.max(1, Number(inputValue) || 1) };
            case "primaryUtility":
              return {
                ...s,
                primaryUtility: checked,
                primary: checked ? [] : s.primary,
                utilityBays: checked || s.auxiliaryUtility === true,
              };
            case "auxiliaryUtility":
              return {
                ...s,
                auxiliaryUtility: checked,
                auxiliary: checked ? [] : s.auxiliary,
                utilityBays: checked || s.primaryUtility === true,
              };
            default:
              return s;
          }
        }),
      }));
      break;
    }
    case "cf-weapon": {
      const fid = currentFoundryId();
      const si = Number(target.dataset["ship"]);
      const wi = Number(target.dataset["index"]);
      const slot = target.dataset["slot"] as "primary" | "auxiliary";
      const field = target.dataset["field"];
      if (!fid || !Number.isInteger(si) || !Number.isInteger(wi) || !field) return;
      editFaction(fid, (f) => ({
        ...f,
        ships: f.ships.map((s, i) => {
          if (i !== si) return s;
          const weapons = s[slot].map((w, j) => {
            if (j !== wi) return w;
            switch (field) {
              case "name":
                return { ...w, name: inputValue };
              case "count":
                return { ...w, count: Math.max(1, Number(inputValue) || 1) };
              case "die":
                return { ...w, die: inputValue as Weapon["die"] };
              case "rangeMin":
                return { ...w, rangeMin: Math.max(0, Number(inputValue) || 0) };
              case "rangeMax":
                return { ...w, rangeMax: Math.max(0, Number(inputValue) || 0) };
              default:
                return w;
            }
          });
          return { ...s, [slot]: weapons };
        }),
      }));
      break;
    }
    case "cf-hvp": {
      const fid = currentFoundryId();
      const hi = Number(target.dataset["index"]);
      const field = target.dataset["field"];
      if (!fid || !Number.isInteger(hi) || !field) return;
      editFaction(fid, (f) => ({
        ...f,
        hvp: f.hvp.map((h, i) =>
          i === hi ? (field === "name" ? { ...h, name: inputValue } : { ...h, rule: inputValue }) : h,
        ),
      }));
      break;
    }
    case "import-faction": {
      const file = target.files?.[0];
      if (!file) return;
      file.text().then((text) => {
        try {
          const parsed = JSON.parse(text) as Faction;
          if (typeof parsed.name !== "string" || !Array.isArray(parsed.ships) || !Array.isArray(parsed.hvp)) {
            showToast("That file does not look like a faction.");
            return;
          }
          parsed.id = newId("cf");
          store.setState((s) => {
            const customFactions = [...s.customFactions, parsed];
            persistCustomFactions(customFactions);
            return { ...s, customFactions };
          });
          showToast(`Imported "${parsed.name}".`);
        } catch {
          showToast("That file could not be read as a faction.");
        }
      });
      target.value = "";
      break;
    }
  }
}

export function wireActions(root: HTMLElement): void {
  root.addEventListener("click", handleClick);
  root.addEventListener("change", handleChange);
}
