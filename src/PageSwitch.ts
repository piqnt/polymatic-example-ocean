/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

export interface PageConfig {
  name: string;
  bookmark?: number;
}

export type PageMap = Record<string, Middleware<any>>;

export interface PageSwitchContext {
  page: PageConfig;
}

export class PageSwitch extends Middleware<PageSwitchContext> {
  pages: PageMap;
  page: Middleware;

  constructor(pages: PageMap) {
    super();
    this.pages = pages;
    this.on("page-set", this.handleSetScreen);
  }

  handleSetScreen = (config: PageConfig) => {
    if (this.page) {
      this.unuse(this.page);
    }

    this.page = this.pages[config.name];

    if (this.page) {
      this.setContext((context) => {
        context.page = config;
      });
      this.use(this.page);
    } else {
      console.log("Unknown page", config.name);
    }
  };
}
