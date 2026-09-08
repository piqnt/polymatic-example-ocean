/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "../model";
import { Power } from "../model";
import { Bubble } from "../model";
import { Calc } from "../model";

export class RandomPower extends Middleware<MainContext> {
  next: number;

  constructor() {
    super();
    this.on("level-start", this.handleLevelStart);
    this.on("insert-bubble", this.handleInsertBubble);
  }

  handleLevelStart = () => {
    this.queueNext();
  };

  handleInsertBubble = (bubble: Bubble) => {
    if (--this.next <= 0) {
      this.insertPower(bubble.position.x, bubble.position.y);
      this.queueNext();
    }
  };

  queueNext() {
    this.next = Calc.randomNumber(50, 200);
  }

  insertPower = (x: number, y: number) => {
    const power = new Power();
    power.position.x = x;
    power.position.y = y;
    this.emit("insert-power", power);
  };
}
