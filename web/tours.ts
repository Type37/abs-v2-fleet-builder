import type { AppState, Route } from "./state.ts";

// First-visit coachmarks: small popovers anchored to a live DOM element,
// shown once per tour until dismissed or completed. Each tour is scoped to
// a single route; positioning happens in main.ts against the real element,
// since this is a full-string re-render app (no component refs to measure).

export interface TourStep {
  /** CSS selector for the element this step points at. */
  selector: string;
  title: string;
  body: string;
}

export interface TourDef {
  id: string;
  view: Route["view"];
  steps: TourStep[];
}

export const TOURS: TourDef[] = [
  {
    id: "compendium-search",
    view: "ships",
    steps: [
      {
        selector: "#ship-search",
        title: "Search",
        body: "Search for ships by name or faction. Combine it with the era, faction, and mass filters to narrow the table further.",
      },
    ],
  },
  {
    id: "roster-expand",
    view: "builder",
    steps: [
      {
        selector: ".roster-unit",
        title: "See Details",
        body: "After adding a ship, click its roster row to open it, rename ships, and adjust the count.",
      },
    ],
  },
];

/** The tour + step that should be visible right now, if any. */
export function activeTour(state: AppState): { tour: TourDef; step: number } | undefined {
  const override = state.ui.tour;
  if (override) {
    const tour = TOURS.find((t) => t.id === override.tourId && t.view === state.route.view);
    return tour ? { tour, step: override.step } : undefined;
  }
  const tour = TOURS.find((t) => t.view === state.route.view && !state.onboarding.toursSeen.includes(t.id));
  return tour ? { tour, step: 0 } : undefined;
}
