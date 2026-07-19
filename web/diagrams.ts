// Vector diagrams for the Learn to Play walkthrough.
//
// Each one animates, because the things being explained are movements: dice
// being rolled, a unit arriving through a jump point, a battlegroup being drawn
// around a lead ship, a hull pivoting and running forward. A static picture of a
// pivot is just an arrow, and an arrow is what the text already says.
//
// All motion is CSS (see the `learn-anim` rules in style.css) so it can be
// switched off wholesale under prefers-reduced-motion - at which point every
// diagram still reads as a labelled still, because the end state is the
// informative one and that is what the animation settles on.
//
// Geometry is drawn to scale where a distance is the point: the 6" bubbles in
// the jump and battlegroup diagrams use one unit = 4px, so a 6" radius is 24px
// against a 24px-wide hull, which is roughly the ratio on a real table.

const SHIP = (x: number, y: number, rot = 0, cls = "dg-ship") =>
  `<g class="${cls}" transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 -9 L6 7 L0 4 L-6 7 Z"/></g>`;

const LABEL = (x: number, y: number, text: string, cls = "dg-label") =>
  `<text class="${cls}" x="${x}" y="${y}">${text}</text>`;

/** The Command Phase: initiative dice land, then CMD tokens stack up. */
function commandDiagram(): string {
  const die = (i: number, x: number) => `
    <g class="dg-die dg-die-${i}" transform="translate(${x} 44)">
      <rect x="-13" y="-13" width="26" height="26" rx="4"/>
      <circle class="dg-pip" cx="0" cy="0" r="2.6"/>
    </g>`;
  const token = (i: number, x: number) => `
    <g class="dg-token dg-token-${i}" transform="translate(${x} 112)">
      <circle r="11"/>
      <path class="dg-token-mark" d="M-4.5 0 L0 -5 L4.5 0 L0 5 Z"/>
    </g>`;
  return `
  <svg class="learn-dg" viewBox="0 0 320 150" role="img"
       aria-label="The Command Phase: roll your initiative dice, then take your command tokens for the round.">
    ${LABEL(160, 16, "1 · Roll your Initiative", "dg-title")}
    ${die(1, 110)}${die(2, 160)}${die(3, 210)}
    ${LABEL(160, 82, "2 · Take your CMD tokens", "dg-title")}
    ${token(1, 118)}${token(2, 146)}${token(3, 174)}${token(4, 202)}
  </svg>`;
}

/**
 * The Jump Phase: a jump point opens, then a unit arrives anywhere inside its
 * 6" bubble. The bubble is the rule - "deploy within 6 inches of a friendly
 * Jump Point" - so it is drawn to scale rather than suggested.
 */
function jumpDiagram(): string {
  return `
  <svg class="learn-dg" viewBox="0 0 320 170" role="img"
       aria-label="The Jump Phase: open a jump point, then deploy a unit wholly within six inches of it.">
    ${LABEL(160, 16, "Open a Jump Point, then Jump In", "dg-title")}
    <circle class="dg-range dg-range-grow" cx="160" cy="95" r="52"/>
    <g class="dg-jumppoint" transform="translate(160 95)">
      <circle class="dg-jp-core" r="9"/>
      <circle class="dg-jp-ring" r="9"/>
    </g>
    ${SHIP(122, 74, -20, "dg-ship dg-arrive dg-arrive-1")}
    ${SHIP(196, 78, 25, "dg-ship dg-arrive dg-arrive-2")}
    ${SHIP(160, 128, 0, "dg-ship dg-arrive dg-arrive-3")}
    <g class="dg-measure" transform="translate(160 95)">
      <line x1="0" y1="0" x2="52" y2="0"/>
      ${LABEL(26, -6, '6"', "dg-measure-text")}
    </g>
  </svg>`;
}

/**
 * Drag to Select: a lead unit, everything unactivated within 6" of it, and a
 * Combined Mass of 10 or less. The ship outside the bubble stays grey to show
 * the boundary is the rule, not a suggestion.
 */
function dragSelectDiagram(): string {
  return `
  <svg class="learn-dg" viewBox="0 0 320 170" role="img"
       aria-label="Drag to Select: a lead unit plus unactivated units within six inches of it, to a combined mass of ten or less.">
    ${LABEL(160, 16, "Drag to Select a battlegroup", "dg-title")}
    <circle class="dg-range dg-range-grow" cx="132" cy="96" r="54"/>
    ${SHIP(132, 96, 0, "dg-ship dg-lead")}
    ${LABEL(132, 118, "lead", "dg-mini")}
    ${SHIP(96, 70, 15, "dg-ship dg-picked dg-picked-1")}
    ${SHIP(170, 68, -10, "dg-ship dg-picked dg-picked-2")}
    ${SHIP(150, 134, 0, "dg-ship dg-picked dg-picked-3")}
    ${SHIP(268, 104, 0, "dg-ship dg-outside")}
    ${LABEL(268, 126, "too far", "dg-mini dg-mini-out")}
    <g class="dg-measure" transform="translate(132 96)">
      <line x1="0" y1="0" x2="54" y2="0"/>
      ${LABEL(27, -6, '6"', "dg-measure-text")}
    </g>
  </svg>`;
}

/** Movement Step: pivot on the spot by any amount, then run straight ahead. */
function movementDiagram(): string {
  return `
  <svg class="learn-dg" viewBox="0 0 320 150" role="img"
       aria-label="Movement Step: pivot any amount on the spot, then move straight ahead up to the ship's Thrust value.">
    ${LABEL(160, 16, "Pivot, then move up to Thrust", "dg-title")}
    <path class="dg-track" d="M60 96 L250 96"/>
    <g class="dg-pivot-arc" transform="translate(60 96)">
      <path d="M0 -26 A26 26 0 0 1 22 -14"/>
    </g>
    <g class="dg-mover">${SHIP(0, 0, 90, "dg-ship")}</g>
    <g class="dg-measure dg-measure-late" transform="translate(60 118)">
      <line x1="0" y1="0" x2="190" y2="0"/>
      <line x1="0" y1="-5" x2="0" y2="5"/>
      <line x1="190" y1="-5" x2="190" y2="5"/>
      ${LABEL(95, 16, "Thrust", "dg-measure-text")}
    </g>
  </svg>`;
}

/**
 * Passive Attacks Step: having moved, the unit suffers fire from any enemy
 * whose range and arc already cover it. Nothing the moving player chooses -
 * which is exactly the step a move-then-shoot summary loses.
 */
function passiveDiagram(): string {
  return `
  <svg class="learn-dg" viewBox="0 0 320 150" role="img"
       aria-label="Passive Attacks Step: enemies whose range and arc cover the unit fire on it automatically.">
    ${LABEL(160, 16, "Enemies in range and arc fire", "dg-title")}
    <g transform="translate(66 96)">
      <path class="dg-arc-fill" d="M0 0 L58 -34 A67 67 0 0 1 58 34 Z"/>
      ${SHIP(0, 0, 90, "dg-ship dg-enemy")}
    </g>
    ${SHIP(214, 96, -90, "dg-ship dg-target")}
    <g class="dg-shots">
      <line class="dg-shot dg-shot-1" x1="80" y1="92" x2="204" y2="92"/>
      <line class="dg-shot dg-shot-2" x1="80" y1="100" x2="204" y2="100"/>
    </g>
    ${LABEL(66, 126, "enemy", "dg-mini")}
    ${LABEL(214, 126, "your unit", "dg-mini")}
  </svg>`;
}

/** Action Step: one action, Open Fire shown as the common case. */
function actionDiagram(): string {
  const die = (i: number, x: number) => `
    <g class="dg-die dg-die-${i}" transform="translate(${x} 112)">
      <rect x="-11" y="-11" width="22" height="22" rx="3.5"/>
      <circle class="dg-pip" cx="0" cy="0" r="2.2"/>
    </g>`;
  return `
  <svg class="learn-dg" viewBox="0 0 320 150" role="img"
       aria-label="Action Step: take one action. Open Fire attacks with all weapon systems, rolling equal to or under Silhouette to hit.">
    ${LABEL(160, 16, "Take one Action — here, Open Fire", "dg-title")}
    <g transform="translate(70 62)">
      <path class="dg-arc-fill dg-arc-pri" d="M0 0 L74 -31 L74 31 Z"/>
      ${SHIP(0, 0, 90, "dg-ship")}
    </g>
    ${SHIP(232, 62, -90, "dg-ship dg-enemy")}
    <line class="dg-shot dg-shot-1" x1="84" y1="62" x2="222" y2="62"/>
    ${LABEL(160, 92, "roll under Silhouette to hit", "dg-mini")}
    ${die(1, 122)}${die(2, 150)}${die(3, 178)}${die(4, 206)}
  </svg>`;
}

const DIAGRAMS: Record<string, () => string> = {
  command: commandDiagram,
  jump: jumpDiagram,
  "drag-select": dragSelectDiagram,
  movement: movementDiagram,
  passive: passiveDiagram,
  action: actionDiagram,
};

/** A named Learn to Play diagram, or an empty string if the name is unknown. */
export function learnDiagram(kind: string): string {
  return DIAGRAMS[kind]?.() ?? "";
}
