/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { UPGRADES, UserData, type MainContext } from "./Context";

export class LocalStore extends Middleware<MainContext> {
  key = "ocean-data";

  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("data-save", this.handleDataSave);
  }

  handleActivate = () => {
    this.context.user = new UserData();
    this.load();
  };

  load = () => {
    const data = this.loadLocal();
    if (!data) return;

    if (data.upgrades) {
      for (let i = 0; i < UPGRADES.length; i++) {
        const name = UPGRADES[i];
        this.context.user.upgrades[name] = data.upgrades[name] ?? 0;
      }
    }

    this.context.user.upgrades.bookmarks = data.upgrades.bookmarks ?? 0;

    if (data.stats) {
      this.context.user.stats.coins = data.stats.coins ?? 0;
      this.context.user.stats.dist = data.stats.dist ?? 0;
    }

    this.context.user.bookmarks = data.bookmarks ?? [];

    this.emit("data-load");
  };

  loadLocal = (): UserData => {
    const key = this.key;
    try {
      const dataString = localStorage.getItem(key);
      if (!dataString) return null;
      const data = JSON.parse(dataString);
      return data;
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  handleDataSave = () => {
    const data = this.context.user;
    const key = this.key;
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem(key, dataString);
    } catch (e) {
      console.log(e);
    }
    this.emit("data-load");
  };
}
