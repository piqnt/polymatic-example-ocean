/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";

import main from "../media/main";

export class StageLoader extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
  }

  handleActivate = async () => {
    await Stage.atlas(main);

    this.emit("stage-ready");
  };
}
