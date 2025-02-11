/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";

/** Moves cursor based on user input. */
export class Gamepad extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("user-pointer", this.handleUserPointer);
  }

  handleUserPointer = ({ x, y }: { x: number; y: number }) => {
    if (this.context.level.player.dead) return;
    this.context.level.cursor.x = x;
    this.context.level.cursor.y = y;
    this.context.level.cursor.fresh = true;
    return this.context.level.speed > 0;
  };

  handleUserMove = ({ x, y }: { x: number; y: number }) => {
    if (this.context.level.player.dead) return;
    this.context.level.cursor.x += x * x * this.context.config.width * (x < 0 ? -1 : 1) * 3;
    this.context.level.cursor.y += y * y * this.context.config.height * (y < 0 ? -1 : 1) * 3;
    this.context.level.cursor.fresh = true;
    return this.context.level.speed > 0;
  };
}
