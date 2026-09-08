/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";
import { Middleware } from "polymatic";

import { type MainContext } from "../model";

/**
 * All that is left of the old stage menu: the artwork behind it. The buttons
 * are shell/HomePage now, drawn in the DOM over this.
 */
export class HomeBackdrop extends Middleware<MainContext> {
  page: Stage.Node;
  background: Stage.Sprite;

  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("deactivate", this.handleDeactivate);
  }

  setup() {
    if (this.page) return;

    this.page = Stage.component();
    this.page.pin({ align: 0.5 });
    this.page.on("viewport", this.handleViewport);

    this.background = Stage.sprite("homebg");
    this.background.appendTo(this.page);
    this.background.pin("align", 0.5);
  }

  handleActivate = () => {
    this.setup();

    const stage = this.context.stage;
    stage.empty();
    stage.append(this.page);
    stage.background("#000");

    this.page.show();
    this.page.pin("alpha", 0);
    this.page.tween(400).pin("alpha", 1);

    this.handleViewport();
  };

  handleDeactivate = () => {
    this.page.remove();
  };

  handleViewport = () => {
    this.page.pin({
      width: this.page.parent().pin("width"),
      height: this.page.parent().pin("height"),
    });

    this.background.pin({
      scaleMode: "out",
      scaleWidth: this.page.pin("width"),
      scaleHeight: this.page.pin("height"),
    });
  };
}
