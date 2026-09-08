/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "../model";
import { StageView } from "./StageView";
import { StageLoader } from "./StageLoader";
import { Upgrade } from "./Upgrade";
import { LocalStore } from "./LocalStore";
import { ConfigLoader } from "./ConfigLoader";
import { FrameLoop } from "./FrameLoop";
import { HudManager } from "./HudManager";

/**
 * The runtime. It owns the stage and the run; the menu, the play hud and the
 * help modal are the shell's (see shell/App), and the two meet at the signals
 * on MainContext.
 */
export class Main extends Middleware<MainContext> {
  constructor() {
    super();
    this.use(new FrameLoop());
    this.use(new ConfigLoader());
    this.use(new StageLoader());
    this.use(new LocalStore());
    this.use(new Upgrade());
    this.use(new StageView());
    this.use(new HudManager());
  }
}
