/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { Pattern, type PatternCallback, type PatternConfig } from "./Pattern";
import { type MainContext } from "./Context";
import { Bubble } from "./Bubble";
import { Calc } from "./Calc";
import { type Enemy } from "./Enemy";

export class RandomPattern extends Middleware<MainContext> {
  next: number;

  constructor() {
    super();
    this.on("level-start", this.handleLevelStart);
    this.on("level-step", this.handleLevelStep);
    this.on("enemy-collected", this.handleEnemyCollected);
  }

  handleLevelStart = () => {
    this.next = this.context.level.dist;
  };

  handleLevelStep = () => {
    while (this.next <= this.context.level.dist) {
      const pattern = Calc.spinWheel(PATTERNS, { dist: this.context.level.dist });
      if (!pattern) continue;

      const patternConfig = {
        xMin: this.context.config.xMin,
        xMax: this.context.config.xMax,
        y: this.next + this.context.config.height,
        space: this.context.config.bubbleSpace,
        hardness: this.context.level.dist / 100000,
      };

      const n = pattern(patternConfig, this.insertBubble);

      this.queueNext(n);
    }
  };

  queueNext = (n: number) => {
    const hardness = Calc.randomNumber(1, 1.5) + this.context.level.dist / 10000;
    this.next += n * hardness * this.context.config.bubbleSpace;
  };

  insertBubble = (x: number, y: number, vx = Calc.randomNumber(0, 2), vy = Calc.randomNumber(0, 2)) => {
    const bubble = new Bubble();
    bubble.position.x = x;
    bubble.position.y = y;
    bubble.velocity.x = vx;
    bubble.velocity.y = vy;
    this.emit("insert-bubble", bubble);
  };

  // release enemy oxygen
  handleEnemyCollected = (entity: Enemy) => {
    if (entity?.type !== "enemy") return;
    const ex = entity.position.x;
    const ey = entity.position.y;
    const n = Calc.randomNumber(8, 14) | 0;
    for (let i = 0; i < n; i++) {
      const r = Calc.randomNumber(10, 16);
      const a = ((i * 2) / n) * Math.PI;
      const x = ex + r * Math.cos(a);
      const y = ey + r * Math.sin(a);
      const vx = Math.cos(a) * 8 * Calc.randomNumber(1, 1.2);
      const vy = Math.sin(a) * 8 * Calc.randomNumber(1, 1);
      this.insertBubble(x, y, vx, vy);
    }
  };
}

type PatternOption = {
  value: (config: PatternConfig, callback: PatternCallback) => number;
  weight: (param: { dist: number }) => number;
};

const PATTERNS: PatternOption[] = [
  {
    value: Pattern.line,
    weight: (p) => 1,
  },
  {
    value: Pattern.slope,
    weight: (p) => 1,
  },
  {
    value: Pattern.stairs,
    weight: (p) => 1,
  },
  {
    value: Pattern.saw,
    weight: (p) => 1,
  },
  {
    value: Pattern.wave,
    weight: (p) => 1,
  },
  {
    value: Pattern.wave2d,
    weight: (p) => 1,
  },
  {
    value: Pattern.zigzag,
    weight: (p) => 1,
  },
  {
    value: Pattern.square,
    weight: (p) => 1,
  },
  {
    value: Pattern.spray,
    weight: (p) => 1,
  },
  {
    value: Pattern.spiral,
    weight: (p) => 1,
  },
];
