"""Find the emblems that are too light to sit on white paper.

The tinting system used to paper over this: a white cut-out mark was invisible
on the sheet, so you re-coloured it. Tinting is gone (it never read as anything
but a flat silhouette), which leaves the real problem exposed - a white logo on
a white page is nothing at all. Those marks get a black tile behind them
instead, which is what a white logo is designed to sit on anyway.

Deciding which are "white" is a measurement, not a judgement call, so it is made
here once rather than guessed at per-emblem. This reads the already-downscaled
thumbnails (web/emblem-thumbs/, built by make-emblem-thumbs.py) rather than the
full-size originals: same pixels for this purpose, a fraction of the IO.

Only pixels the mark actually paints are counted. Averaging in the transparent
background would call every cut-out mark light, which is the opposite of useful.

SVGs are skipped. They are not in the thumbnail tree, and they draw with
currentColor - so they inherit the ink colour and are dark by construction.

Run: python scripts/find-light-emblems.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
THUMBS = ROOT / "web" / "emblem-thumbs"

# Mean luminance above which a mark cannot be trusted on white. Picked by
# eye against the library: 0.62 keeps mid-grey steel marks on the plain
# background and catches the near-white ones.
LIGHT_AT = 0.62
# Alpha below which a pixel is background rather than mark.
OPAQUE_AT = 128


def mean_luminance(path: Path) -> float | None:
    """Mean Rec. 601 luminance of the opaque pixels, 0..1. None if nothing is drawn."""
    with Image.open(path) as im:
        im = im.convert("RGBA")
        total = 0.0
        count = 0
        for r, g, b, a in im.getdata():
            if a < OPAQUE_AT:
                continue
            total += (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            count += 1
    if not count:
        return None
    return total / count


def main() -> int:
    if not THUMBS.is_dir():
        print(f"no thumbnail folder at {THUMBS} - run make-emblem-thumbs.py first", file=sys.stderr)
        return 1

    light: list[str] = []
    scanned = 0
    for path in sorted(THUMBS.rglob("*.webp")):
        key = path.relative_to(THUMBS).with_suffix("").as_posix()
        try:
            lum = mean_luminance(path)
        except Exception as exc:
            print(f"  skip {key}: {exc}", file=sys.stderr)
            continue
        scanned += 1
        if lum is not None and lum >= LIGHT_AT:
            light.append(key)

    out = THUMBS / "light.json"
    out.write_text(json.dumps(sorted(light), indent=0), encoding="utf-8")
    print(f"scanned {scanned} thumbnails, {len(light)} need a dark ground -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
