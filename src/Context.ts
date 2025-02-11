/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { type Coin } from "./Coin";
import { type Enemy } from "./Enemy";
import { type Power } from "./Power";
import { type Bubble } from "./Bubble";
import { type Player } from "./Player";
import { type PageConfig } from "./PageSwitch";
import { type Config } from "./Config";

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

export class UserData {
  upgrades: Upgrades = new Upgrades();
  bookmarks: number[] = [];
  stats: Stats = new Stats();
}

export interface Cursor {
  x: number;
  y: number;
  fresh?: boolean;
  speed?: number;
}

export class LevelData {
  // width: number;
  // height: number;

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

export interface MainContext {
  stage?: Stage.Root;
  user?: UserData;
  level?: LevelData;
  page?: PageConfig;
  config: typeof Config;
}
