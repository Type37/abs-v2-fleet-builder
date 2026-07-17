// Screen-reader announcements.
//
// The app replaces #app wholesale on every state change, so anything rendered
// inside it cannot be a live region: a region that is created in the same breath
// as its own text is not announced, because the AT never saw it empty first.
// The region therefore lives in index.html, outside #app, and is written to
// from here. main.ts owns painting; this stays a separate module so actions.ts
// can announce without importing main.ts back (which would be circular).

const region = () => document.getElementById("sr-status");

let timer: ReturnType<typeof setTimeout> | undefined;

/**
 * Speak a short message. Say what changed, not what is on screen: "Fleet copied
 * as text", "2 to resolve", not the whole roster.
 */
export function announce(message: string): void {
  const el = region();
  if (!el) return;
  // Clearing first means an identical repeat message still fires: setting the
  // same textContent twice is a no-op to the AT, so "1 to resolve" would be
  // announced once and then silently swallowed every time after.
  el.textContent = "";
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    el.textContent = message;
  }, 50);
}
