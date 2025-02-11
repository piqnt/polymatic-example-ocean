/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";
import { Enemy } from "./Enemy";
import { Calc } from "./Calc";

export class RandomEnemy extends Middleware<MainContext> {
  next: number;

  constructor() {
    super();
    this.on("level-start", this.handleLevelStart);
    this.on("level-step", this.handleLevelStep);
  }

  handleLevelStart = () => {
    this.next = this.context.level.dist;
    this.queueNext();
  };

  handleLevelStep = () => {
    while (this.next <= this.context.level.dist) {
      const factory = Calc.spinWheel(ENEMIES);
      if (!factory) continue;
      const enemyConfig = {
        dist: this.next + this.context.config.height,
        speed: this.context.level.speed,
        width: this.context.config.width,
      };
      factory(enemyConfig, this.insertEnemy);

      this.queueNext();
    }
  };

  queueNext() {
    this.next += Calc.randomNumber(20, 200);
  }

  insertEnemy = (name: string, x: number, y: number, vx = 0, vy = 0) => {
    const enemy = new Enemy(name);
    enemy.position.x = x;
    enemy.position.y = y;
    enemy.velocity.x = vx;
    enemy.velocity.y = vy;
    this.emit("insert-enemy", enemy);
  };
}

type EnemyOption = {
  value: (
    config: { dist: number; speed: number; width: number },
    callback: (name: string, x: number, y: number, vx?: number, vy?: number) => void,
  ) => void;
};

const ENEMIES: EnemyOption[] = [
  {
    value: (config, callback) => {
      const x = Calc.randomNumber(-0.5, 0.5) * config.width;
      callback("octopus", x, config.dist);
    },
  },
  {
    value: (config, callback) => {
      const side = Math.random() >= 0.5 ? 1 : -1;
      const vx = -side * config.speed * Calc.randomNumber(0.35, 0.7);
      const vy = 0;
      const x = side * (config.width / 2) - 0.4 * vx; // 0.4s x-adjustment
      const y = config.dist + 0.4 * config.speed; // 0.4s y-adjustment
      callback("shark", x, y, vx, vy);
    },
  },
];
