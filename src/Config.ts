/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";

export const Config = {
  /** play field width */
  width: 120,
  /** play field width */
  height: 240,

  /** max x to add entities */
  xMax: +0.47 * 120,
  /** min x to add entities */
  xMin: -0.47 * 120,

  /** base speed per seconds */
  speed: 110,
  /** speed acceleration */
  acceleration: 0.0008,

  itemSpace: 20,
  bubbleSpace: 6,

  notch: 0,
};

export class ConfigLoader extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
  }

  handleActivate = () => {
    this.context.config = Config;
  };
}
