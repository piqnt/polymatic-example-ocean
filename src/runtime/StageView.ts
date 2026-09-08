/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { Middleware } from "polymatic";

import { type MainContext } from "../model";
import { PageSwitch } from "./PageSwitch";
import { HomeBackdrop } from "./HomeBackdrop";
import { LevelView } from "./LevelView";
import { EndPage } from "./EndPage";

/**
 * Mounts the stage and keeps it fitted to the play field, then hands the page
 * over to PageSwitch. This used to be Terminal, and used to own the menu and
 * the help dialog too - both are Preact now (see shell/).
 */
export class StageView extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("stage-ready", this.handleStageReady);

    this.use(
      new PageSwitch({
        // the menu is a Preact page; all that is left on the stage behind it is
        // the backdrop
        "home-page": new HomeBackdrop(),
        "play-page": new LevelView(),
        "end-page": new EndPage(),
      }),
    );
  }

  handleActivate = () => {
    const stage = Stage.mount();

    stage.on("viewport", (viewport) => {
      stage.pin({
        width: this.context.config.width,
        height: this.context.config.height,
        scaleMode: "in-pad",
        scaleWidth: viewport.width,
        scaleHeight: viewport.height - this.context.config.notch,
        offsetY: this.context.config.notch,
      });
    });

    this.context.stage = stage;
  };

  handleStageReady = () => {
    this.context.ready.value = true;
    this.emit("page-set", { name: "home-page" });
  };
}
