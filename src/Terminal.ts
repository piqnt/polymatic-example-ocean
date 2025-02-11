/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";
import { PageSwitch } from "./PageSwitch";
import { HomePage } from "./HomePage";
import { LevelPage } from "./LevelPage";
import { EndPage } from "./EndPage";
import { HelpPage } from "./HelpPage";

export class Terminal extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("stage-ready", this.handleStageReady);

    this.use(
      new PageSwitch({
        "home-page": new HomePage(),
        "play-page": new LevelPage(),
        "end-page": new EndPage(),
        "help-page": new HelpPage(),
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

    this.setContext((context) => {
      context.stage = stage;
    });
  };

  handleStageReady = () => {
    this.emit("page-set", { name: "home-page" });
  };
}
