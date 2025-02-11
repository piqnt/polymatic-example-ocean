/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";
import { Coin } from "./Coin";
import { Calc } from "./Calc";

export class RandomCoin extends Middleware<MainContext> {
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
      const value = Calc.spinWheel(COINS, { dist: this.context.level.dist });
      if (!value) continue;
      const x = Calc.randomNumber(this.context.config.xMin, this.context.config.xMax);
      const y = this.next + this.context.config.height;
      this.insertCoin(value, x, y);

      this.queueNext();
      return true;
    }
  };

  queueNext() {
    this.next += Calc.randomNumber(100, 400);
  }

  insertCoin = (value: number, x: number, y: number) => {
    const coin = new Coin(value);
    coin.position.x = x;
    coin.position.y = y;
    this.emit("insert-coin", coin);
  };
}

type CoinOption = {
  value: number;
  weight: (param: { dist: number }) => number;
};

export const COINS: CoinOption[] = [
  {
    value: 1,
    weight: () => 1,
  },
  {
    value: 2,
    weight: (param) => (param.dist > 1000 ? 1 : 0),
  },
  {
    value: 5,
    weight: (param) => (param.dist > 2000 ? 2 : 0),
  },
  {
    value: 10,
    weight: (param) => (param.dist > 5000 ? 4 : 0),
  },
  {
    value: 20,
    weight: (param) => (param.dist > 10000 ? 8 : 0),
  },
  {
    value: 50,
    weight: (param) => (param.dist > 20000 ? 16 : 0),
  },
  {
    value: 100,
    weight: (param) => (param.dist > 50000 ? 32 : 0),
  },
  {
    value: 1000,
    weight: (param) => (param.dist > 50000 ? (4 * param.dist) / 100000 : 0),
  },
  {
    value: 10000,
    weight: (param) => (param.dist > 70000 ? (2 * param.dist) / 100000 : 0),
  },
  {
    value: 100000,
    weight: (param) => (param.dist > 100000 ? param.dist / 100000 : 0),
  },
  {
    value: 100000,
    weight: (param) => (param.dist > 150000 ? (0.5 * param.dist) / 100000 : 0),
  },
];
