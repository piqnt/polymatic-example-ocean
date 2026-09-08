/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext, type PageConfig } from "../model";

export type PageMap = Record<string, Middleware<any>>;

/**
 * Swaps in the middleware that runs the named page, and publishes the choice on
 * `context.page` so the shell knows what to draw.
 *
 * The menu is a Preact page now (shell/HomePage), so "home-page" maps to a
 * middleware that only paints the backdrop on the stage behind it.
 */
export class PageSwitch extends Middleware<MainContext> {
  pages: PageMap;
  page: Middleware;

  constructor(pages: PageMap) {
    super();
    this.pages = pages;
    this.on("page-set", this.handleSetPage);
  }

  handleSetPage = (config: PageConfig) => {
    if (this.page) {
      this.unuse(this.page);
    }

    this.page = this.pages[config.name];

    if (this.page) {
      this.context.page.value = config;
      this.use(this.page);
    } else {
      console.log("Unknown page", config.name);
    }
  };
}
