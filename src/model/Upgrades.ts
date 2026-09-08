/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const UPGRADES = ["pull", "speed", "push", "power", "oxygen", "slow"];

export class Stats {
  coins?: number = 0;
  dist?: number = 0;
}

export class Upgrades {
  power?: number = 0;
  oxygen?: number = 0;
  speed?: number = 0;
  pull?: number = 0;
  push?: number = 0;
  slow?: number = 0;

  bookmarks?: number = 0;
}

/** What is saved between runs: what you own, and how far you have got. */
export class UserData {
  upgrades: Upgrades = new Upgrades();
  bookmarks: number[] = [];
  stats: Stats = new Stats();
}
