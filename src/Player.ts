/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { nanoid } from "nanoid";

import { type Upgrades } from "./Context";

export class Player {
  key = "player-" + nanoid(6);
  type = "player" as const;

  x = 0;
  y = 0;
  radius = 6;

  name = "player";
  dead = false;

  power: number;
  oxygen: number;
  speed: number;
  pull: number;
  push: number;
  slow: number;

  constructor() {
    this.upgrade({});
  }

  upgrade = (ups: Upgrades) => {
    this.power = 500 + (ups.power ?? 0) * 250;
    this.oxygen = 0.0008 * (1 - (ups.oxygen ?? 0) / 8);
    this.speed = 0.2 + (ups.speed ?? 0) * 0.02;
    this.pull = ups.pull ?? 0;
    this.push = ups.push ?? 0;
    this.slow = 1 / ((ups.slow ?? 0) * 0.2 + 1);
  };
}
