/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Calc } from "./Calc";

export interface PatternConfig {
  xMax: number;
  xMin: number;
  y: number;
  space: number;
  hardness: number;
}

export type PatternCallback = (x: number, y: number) => void;

export class Pattern {
  static line = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(40, 50);
    const x = Calc.randomNumber(config.xMin, config.xMax);
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(x, y + i * config.space);
    }
    return added;
  };

  static slope = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(20, 40) | 0;
    const dispersion = disperse(config.xMin, config.xMax, Calc.randomNumber(0.2, 0.7));
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(dispersion.from + (i * dispersion.range) / n, y + i * config.space);
    }
    return added;
  };

  static wave = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(40, 60);
    const a = config.space / Calc.randomNumber(10, 30);
    const b = Calc.randomNumber(10, 30);
    const x = Calc.randomNumber(config.xMin + b, config.xMax - b);
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(x + b * Math.sin(i * a), y + i * config.space);
    }
    return added;
  };

  static stairs = (config: PatternConfig, callback: PatternCallback) => {
    const p = Calc.randomNumber(3, 6) | 0;
    const q = Calc.randomNumber(5, 15) | 0;
    const n = p * q;
    const dispersion = disperse(config.xMin, config.xMax, Calc.randomNumber(0.3, 0.7));
    const y = config.y;

    const m = dispersion.range / p;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(dispersion.from + (((i * dispersion.range) / n / m) | 0) * m, y + i * config.space);
    }
    return added;
  };

  static saw = (config: PatternConfig, callback: PatternCallback) => {
    const p = Calc.randomNumber(2, 6) | 0;
    const q = Calc.randomNumber(7, 13) | 0;
    const n = p * q;
    const dispersion = disperse(config.xMin, config.xMax, Calc.randomNumber(0.1, 0.6));
    const y = config.y;

    const m = dispersion.range;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(
        dispersion.from + (((-i * dispersion.range) / q / m) | 0) * m + (i * dispersion.range) / q,
        y + i * config.space,
      );
    }
    return added;
  };

  static wave2d = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(40, 60);
    const a = config.space / Calc.randomNumber(10, 40);
    const b = Calc.randomNumber(10, 30);
    const c = config.space / Calc.randomNumber(10, 40);
    const d = Calc.randomNumber(10, 30);
    const x = Calc.randomNumber(config.xMin + b, config.xMax - b);
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(x + b * Math.sin(i * a), y + i * config.space + d * Math.cos(i * c));
    }
    return added;
  };

  static zigzag = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(40, 60);
    const a = config.space / Calc.randomNumber(10, 40);
    const b = Calc.randomNumber(10, 30);
    const x = Calc.randomNumber(config.xMin + b, config.xMax - b);
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(x + b * zigzag(i * a), y + i * config.space);
    }
    return added;
  };

  // zigzag xy
  static zigzag2d = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(40, 60);
    const a = config.space / Calc.randomNumber(10, 40);
    const b = Calc.randomNumber(10, 30);
    const c = config.space / Calc.randomNumber(10, 40);
    const d = Calc.randomNumber(10, 30);
    const x = Calc.randomNumber(config.xMin + b, config.xMax - b);
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(x + b * zigzag(i * a), y + i * config.space + d * zagzig(i * c));
    }
    return added;
  };

  static square = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(3, 8);
    const m = n;
    const x = Calc.randomNumber(config.xMin, config.xMax - m * config.space);
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        added++;
        callback(x + j * config.space, y + i * config.space);
      }
    }
    return added;
  };

  static spray = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(40, 60);
    const dispersion = disperse(config.xMin, config.xMax, 0.2 + config.hardness);
    const y = config.y;

    let added = 0;
    for (let i = 0; i < n; i++) {
      added++;
      callback(Calc.randomNumber(dispersion.from, dispersion.to), y + i * config.space);
    }
    return added;
  };

  static spiral = (config: PatternConfig, callback: PatternCallback) => {
    const n = Calc.randomNumber(40, 60);
    const f = (1 - Math.sqrt(5)) / 2; // golden ratio
    const c = Calc.randomNumber(0.5, 0.5 + config.hardness / 2);
    const y = config.y + c * n + 10;

    let added = 0;
    for (let i = 10; i < n + 10; i++) {
      added++;
      callback(c * i * Math.cos(i * f * Math.PI * 2), y + c * i * Math.sin(i * f * Math.PI * 2));
    }
    return added;
  };
}

function zigzag(this: unknown, t: number) {
  t = (Calc.wrapNumber(t, -Math.PI, Math.PI) / Math.PI) * 2;
  if (t > 1) {
    t = 2 - t;
  } else if (t < -1) {
    t = -2 - t;
  }
  return t;
}

function zagzig(this: unknown, t: number) {
  return zigzag(t + Math.PI / 2);
}

/** dispersion between 0 to 1 */
function disperse(this: unknown, min: number, max: number, dispersion: number) {
  let range = dispersion * (max - min);
  const center = Calc.randomNumber(min + range / 2, max - range / 2);
  range *= Math.random() >= 0.5 ? 1 : -1;
  return {
    from: center - range / 2,
    to: center + range / 2,
    range: range,
    center: center,
  };
}
