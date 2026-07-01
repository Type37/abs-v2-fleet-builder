import type { Hvp } from "../types.ts";

// Generic High-Value Personnel (rules p.57). Always available to any faction,
// in addition to the faction's own HVP.
export const GENERIC_HVP: Hvp[] = [
  {
    id: "executive-officer",
    name: "Executive Officer",
    rule: "Units in this unit's battlegroup can use the Executive Oversight command for 0 CMD once per activation.",
  },
  {
    id: "seasoned-captain",
    name: "Seasoned Captain",
    rule: "Units in this unit's battlegroup can use the Red Alert command for 0 CMD once per Round.",
  },
  {
    id: "chief-weapons-officer",
    name: "Chief Weapons Officer",
    rule: "Units in this unit's battlegroup can use the Power to Weapons command for 0 CMD once per Round.",
  },
  {
    id: "chief-science-officer",
    name: "Chief Science Officer",
    rule: "Units in this unit's battlegroup can use the Power to Shields command for 0 CMD once per Round.",
  },
  {
    id: "chief-engineer",
    name: "Chief Engineer",
    rule: "Units in this unit's battlegroup can use the Power to Engines command for 0 CMD once per Round.",
  },
];
