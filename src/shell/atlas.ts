/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import mainImage from "../../media/main.png";

/**
 * Draws a sprite out of the same atlas the game renders from, as a css
 * background - so the logo, the button plates, the upgrade icons and the coins
 * in the DOM are the artwork itself, not a lookalike.
 *
 * The rects below are copied from media/main.ts, in the units that file is
 * written in. Stage multiplies those by `ppu` (16) to get stage units, which is
 * what `--u` measures, so every length here is `unit x 16 x --u`. The
 * png's own `ratio` never enters into it: the sheet is 16 x 8 of those units
 * whatever its pixel size.
 */
const PPU = 16;
const SHEET_WIDTH = 16;
const SHEET_HEIGHT = 8;

export interface AtlasRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function atlasStyle(rect: AtlasRect, scale = 1) {
  const u = (n: number) => `calc(var(--u) * ${n * PPU * scale})`;
  return {
    backgroundImage: `url(${mainImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${u(SHEET_WIDTH)} ${u(SHEET_HEIGHT)}`,
    backgroundPosition: `${u(-rect.x)} ${u(-rect.y)}`,
    width: u(rect.width),
    height: u(rect.height),
  };
}

export const LOGO: AtlasRect = { x: 12, y: 0, width: 4, height: 1.8 };
export const PLAY_PLATE: AtlasRect = { x: 12.25, y: 2.25, width: 1.5, height: 1.5 };
export const OPTION_PLATE: AtlasRect = { x: 14.25, y: 2.25, width: 1.5, height: 1.5 };

const UPGRADE_ORDER = ["power", "oxygen", "speed", "pull", "push", "slow"];

export const upgradeIcon = (name: string): AtlasRect => ({
  x: 6 + Math.max(0, UPGRADE_ORDER.indexOf(name)),
  y: 0,
  width: 1,
  height: 1,
});

const COIN_VALUES = [1, 2, 5, 10, 20, 50, 100, 1000, 10000, 100000, 1000000];

export const coinIcon = (value: number): AtlasRect => ({
  x: Math.max(0, COIN_VALUES.indexOf(value)),
  y: 1,
  width: 1,
  height: 1,
});

/** the sprite coin sizes the level view draws each denomination at */
export const COIN_SCALE: Record<number, number> = {
  1: 0.7,
  2: 0.75,
  5: 0.8,
  10: 0.9,
  20: 0.95,
  50: 1,
  100: 1.1,
};
