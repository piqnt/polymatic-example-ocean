/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type Coin } from "./Coin";
import { type Enemy } from "./Enemy";
import { type Power } from "./Power";
import { type Bubble } from "./Bubble";
import { type Player } from "./Player";

export interface Cursor {
  x: number;
  y: number;
  fresh?: boolean;
  speed?: number;
}

/** The run in progress. Plain fields: the runtime writes them every frame. */
export class LevelData {
  dist: number;
  speed: number;

  oxygen: number;
  coins: number;
  power: number;

  objects: (Enemy | Power | Coin | Bubble)[] = [];
  player: Player;
  cursor: Cursor;

  stats = {
    bubbles: 0,
    power: 0,
    coins: {
      "1": 0,
      "2": 0,
      "5": 0,
      "10": 0,
      "20": 0,
      "50": 0,
      "100": 0,
      "1000": 0,
      "10000": 0,
    },
    enemies: {
      shark: 0,
      octopus: 0,
    },
  };
}
