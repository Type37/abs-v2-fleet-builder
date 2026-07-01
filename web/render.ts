import type { AppState } from "./state.ts";
import type { AllianceSpecies, Faction, Fleet, Hvp } from "../src/types.ts";
import { ALLIANCE_SPECIES } from "../src/types.ts";
import {
  defaultCatalog,
  validateFleet,
  fleetCost,
  maxUnitSize,
  HVP_REQUIRED,
  STANDARD_LIMITS,
  ARMAGEDDON_FACTIONS,
  GENERIC_HVP,
  type ValidationResult,
} from "../src/index.ts";
import { primarySlotText, auxSlotText, credits, escapeHtml } from "./format.ts";

export function renderApp(root: HTMLElement, state: AppState): void {
  const fleet = state.fleet;
  const faction = defaultCatalog.getFaction(fleet.factionId);
  const result = faction ? validateFleet(fleet, defaultCatalog) : null;

  root.innerHTML = [
    renderMasthead(),
    renderControlBar(fleet),
    `<div class="layout">`,
    `  <main class="roster-panel">${faction ? renderRoster(faction) : renderNoFaction()}</main>`,
    `  <aside class="manifest-panel">`,
    `    ${renderManifest(faction, fleet)}`,
    `    ${faction ? renderHvpSection(faction, fleet) : ""}`,
    `    ${result ? renderValidation(result) : ""}`,
    `  </aside>`,
    `</div>`,
    renderFootnote(),
  ].join("\n");

  const nameInput = root.querySelector<HTMLInputElement>("#fleet-name");
  if (nameInput) nameInput.value = fleet.name ?? "";
}

function renderMasthead(): string {
  return `
    <header class="masthead">
      <h1>A Billion Suns</h1>
      <p class="masthead-sub">Fleet Register &middot; Armageddon Era</p>
    </header>
  `;
}

function renderControlBar(fleet: Fleet): string {
  const tabs = ARMAGEDDON_FACTIONS.map(
    (f) =>
      `<button type="button" class="faction-tab" data-action="set-faction" data-faction-id="${f.id}" aria-pressed="${f.id === fleet.factionId}">${f.name}</button>`,
  ).join("");

  const limits = STANDARD_LIMITS.map(
    (l) =>
      `<button type="button" class="credits-option" data-action="set-credits" data-limit="${l}" aria-pressed="${l === fleet.creditsLimit}">${credits(l)}</button>`,
  ).join("");

  return `
    <div class="control-bar">
      <div>
        <span class="field-label">Faction</span>
        <div class="faction-tabs">${tabs}</div>
      </div>
      <div>
        <span class="field-label">Credits Limit</span>
        <div class="credits-options">${limits}</div>
      </div>
      <label class="fleet-name-field">
        <span class="field-label">Fleet Name</span>
        <input type="text" id="fleet-name" placeholder="e.g. Grenadine Peacekeepers Precinct 219" />
      </label>
    </div>
  `;
}

function renderNoFaction(): string {
  return `<p class="empty-note">Select a faction to browse its ship register.</p>`;
}

function renderRoster(faction: Faction): string {
  const rows = faction.ships
    .map((ship) => {
      const max = maxUnitSize(ship.mass);
      return `
        <tr>
          <td class="ship-name">${ship.name}</td>
          <td class="num">${ship.mass}</td>
          <td class="num">${ship.thrust}″</td>
          <td class="num">${ship.silhouette}</td>
          <td class="num">${ship.shields}</td>
          <td class="weapon-cell">${primarySlotText(ship)}</td>
          <td class="weapon-cell">${auxSlotText(ship)}</td>
          <td class="num">${credits(ship.cost)}</td>
          <td class="num">
            <button type="button" class="add-btn" data-action="add-unit" data-ship="${ship.id}" title="Add a unit of ${ship.name} (max ${max} hull${max > 1 ? "s" : ""})">+</button>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <h2 class="section-title">${faction.name} &mdash; Ship Register</h2>
    <p class="faction-rule"><strong>${faction.rule.name}.</strong> ${faction.rule.text}</p>
    <table class="roster-table">
      <thead>
        <tr>
          <th>Class</th>
          <th class="num">Mass</th>
          <th class="num">Thrust</th>
          <th class="num">Sil.</th>
          <th class="num">Shields</th>
          <th>Primary</th>
          <th>Auxiliary</th>
          <th class="num">Cost</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderManifest(faction: Faction | undefined, fleet: Fleet): string {
  const rows = fleet.units
    .map((unit) => {
      const ship = faction?.ships.find((s) => s.id === unit.shipClassId);
      const name = ship?.name ?? unit.shipClassId;
      const unitCost = ship ? ship.cost * unit.count : 0;
      const max = ship ? maxUnitSize(ship.mass) : 3;

      const stepper =
        max > 1
          ? `<div class="stepper">
              <button type="button" data-action="unit-dec" data-unit="${unit.id}" aria-label="Remove one hull">&minus;</button>
              <span class="count">${unit.count}</span>
              <button type="button" data-action="unit-inc" data-unit="${unit.id}" aria-label="Add one hull" ${unit.count >= max ? "disabled" : ""}>+</button>
            </div>`
          : `<span class="single-hull">single hull</span>`;

      const speciesField = faction?.requiresSpecies
        ? `<select class="species-select" data-action="set-species" data-unit="${unit.id}">
            <option value="" ${!unit.species ? "selected" : ""}>&mdash; species &mdash;</option>
            ${ALLIANCE_SPECIES.map(
              (sp) => `<option value="${sp}" ${unit.species === sp ? "selected" : ""}>${sp}</option>`,
            ).join("")}
          </select>`
        : "";

      return `
        <div class="unit-row">
          <div class="unit-meta">
            <div class="unit-name">${name}<span class="unit-cost">${credits(unitCost)}</span></div>
            ${speciesField}
          </div>
          ${stepper}
          <button type="button" class="remove-btn" data-action="remove-unit" data-unit="${unit.id}" title="Remove unit" aria-label="Remove unit">&#10005;</button>
        </div>
      `;
    })
    .join("");

  const totalCost = faction ? fleetCost(fleet, defaultCatalog) : 0;
  const limit = fleet.creditsLimit;
  const pct = limit > 0 ? Math.min(100, Math.round((totalCost / limit) * 100)) : 0;
  const over = totalCost > limit;

  return `
    <div class="manifest-box">
      <h2 class="section-title">Fleet Manifest</h2>
      ${rows || `<p class="empty-note">No units added yet. Add ships from the register.</p>`}
      <div class="budget-figures">
        <span>${credits(totalCost)} spent</span>
        <span class="${over ? "over-label" : ""}">${over ? `${credits(totalCost - limit)} over` : `${credits(limit - totalCost)} remaining`}</span>
      </div>
      <div class="budget-bar"><div class="budget-fill ${over ? "over" : ""}" style="width:${pct}%"></div></div>
      <div class="budget-limit-label">of ${credits(limit)} limit</div>
    </div>
  `;
}

function renderHvpSection(faction: Faction, fleet: Fleet): string {
  const atLimit = fleet.hvp.length >= HVP_REQUIRED;
  const eligibleUnits = fleet.units.filter((u) => faction.ships.some((s) => s.id === u.shipClassId));

  function renderGroup(title: string, items: Hvp[]): string {
    const rows = items
      .map((hvp) => {
        const sel = fleet.hvp.find((h) => h.hvpId === hvp.id);
        const checked = sel !== undefined;
        const disabled = !checked && atLimit;

        const options = eligibleUnits
          .filter((u) => {
            const ship = faction.ships.find((s) => s.id === u.shipClassId)!;
            return ship.mass >= 1 || hvp.canEmbarkMass0 === true;
          })
          .map((u) => {
            const ship = faction.ships.find((s) => s.id === u.shipClassId)!;
            return `<option value="${u.id}" ${sel?.assignedUnitId === u.id ? "selected" : ""}>${ship.name} (${u.id})</option>`;
          })
          .join("");

        return `
          <div class="hvp-row">
            <label class="hvp-check-line">
              <input type="checkbox" data-action="toggle-hvp" data-hvp="${hvp.id}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
              <span>
                <span class="hvp-name">${hvp.name}</span>
                <span class="hvp-rule">${hvp.rule}</span>
              </span>
            </label>
            ${
              checked
                ? `<div class="hvp-assign">
                    <select class="assign-select" data-action="assign-hvp" data-hvp="${hvp.id}">
                      <option value="">&mdash; unassigned &mdash;</option>
                      ${options}
                    </select>
                  </div>`
                : ""
            }
          </div>
        `;
      })
      .join("");
    return `<h3 class="hvp-group-title">${title}</h3>${rows}`;
  }

  return `
    <div class="manifest-box">
      <h2 class="section-title">High-Value Personnel <span class="hvp-count">(${fleet.hvp.length}/${HVP_REQUIRED})</span></h2>
      ${renderGroup(`${faction.name} Personnel`, faction.hvp)}
      ${renderGroup("Generic Personnel", GENERIC_HVP)}
    </div>
  `;
}

function renderValidation(result: ValidationResult): string {
  if (result.valid && result.warnings.length === 0) {
    return `
      <div class="manifest-box validation-box">
        <div class="approved-stamp">Fleet List Approved</div>
        <p class="approved-note">Ready to muster for Armageddon.</p>
      </div>
    `;
  }

  const items = [...result.errors, ...result.warnings]
    .map(
      (i) =>
        `<li class="validation-item ${i.severity}"><span class="validation-marker">${i.severity === "error" ? "✕" : "⚠"}</span><span>${escapeHtml(i.message)}</span></li>`,
    )
    .join("");

  return `
    <div class="manifest-box validation-box">
      <h2 class="section-title">Register of Issues</h2>
      <ul class="validation-list">${items}</ul>
    </div>
  `;
}

function renderFootnote(): string {
  return `<p class="footnote">This register covers fleet composition only. Battlegroups, jump points and mission scoring are determined during play.</p>`;
}

// Re-exported so main.ts can type checkbox/select event handlers without importing from src directly.
export type { AllianceSpecies };
