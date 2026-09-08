/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const reuse_odds: number[] = [];

export class Calc {
  static lengthOf(a: number, b: number) {
    return Math.sqrt(a * a + b * b);
  }

  static randomNumber(min?: number, max?: number) {
    if (typeof min === "undefined") {
      max = 1;
      min = 0;
    } else if (typeof max === "undefined") {
      max = min;
      min = 0;
    }
    return min == max ? min : Math.random() * (max - min) + min;
  }

  static wrapNumber(num: number, min?: number, max?: number) {
    if (typeof min === "undefined") {
      max = 1;
      min = 0;
    } else if (typeof max === "undefined") {
      max = min;
      min = 0;
    }
    if (max > min) {
      num = (num - min) % (max - min);
      return num + (num < 0 ? max : min);
    } else {
      num = (num - max) % (min - max);
      return num + (num <= 0 ? min : max);
    }
  }

  static spinWheel<V>(
    options: {
      value: V;
      weight?: number | (() => number);
    }[],
  ): V | null;
  static spinWheel<V, P>(
    options: {
      value: V;
      weight?: number | ((data: P) => number);
    }[],
    param: P,
  ): V | null;
  static spinWheel<V, P>(
    options: {
      value: V;
      weight?: number | ((data?: P) => number);
    }[],
    param?: P,
  ): V | null {
    const length = options.length;
    let total = 0;
    for (let i = 0; i < length; i++) {
      const option = options[i];
      if (typeof option.weight === "function") {
        reuse_odds[i] = option.weight(param);
      } else if (typeof option.weight === "number") {
        reuse_odds[i] = option.weight;
      } else {
        reuse_odds[i] = 1;
      }
      total += reuse_odds[i];
    }

    let random = Math.random() * total;
    let selected: V | null = null;
    for (let i = 0; i < length; i++) {
      const option = options[i];
      selected = option.value; // let last one be selected
      random -= reuse_odds[i];
      if (random < 0) break;
    }
    return selected;
  }
}
