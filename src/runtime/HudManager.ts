/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type Coin, type MainContext, UPGRADES, upgradePrice } from "../model";

/**
 * The one place the runtime talks to the shell.
 *
 * The run's numbers are copied onto `context.hud`'s signals once per frame; the
 * menu's are refreshed whenever the saved data is written or read, which is the
 * only time they can change. Signals only notify on a real change, so a frame
 * that moves nothing visible re-renders nothing.
 */
export class HudManager extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("frame-render", this.handleFrameRender);

    this.on("data-load", this.updateUser);
    this.on("data-save", this.updateUser);
    // a fresh profile is never loaded from anywhere, so the menu would other-
    // wise open blank the first time it is opened
    this.on("page-set", this.updateUser);

    this.on("delete-entity", this.handleDeleteEntity);
  }

  handleFrameRender = () => {
    const level = this.context.level;
    const hud = this.context.hud;
    // the menu is up between runs, and there is no level then
    if (!level) return;

    hud.coins.value = level.coins;
    hud.dist.value = level.dist;

    // the same widths the sprite bars were stretched to
    hud.oxygenWidth.value = Math.max(0, level.oxygen * 25);
    hud.oxygenLow.value = level.oxygen < 0.35;
    hud.powerWidth.value = Math.max(0, level.power / 30);
  };

  /** A coin picked up flashes its value at the top of the screen. */
  handleDeleteEntity = (entity: Coin) => {
    if (entity?.type !== "coin" || !entity.collected) return;
    const hud = this.context.hud;
    hud.lastCoin.value = entity.value;
    // two coins of the same value in a row still count as a new pickup
    hud.lastCoinNonce.value = hud.lastCoinNonce.value + 1;
  };

  updateUser = () => {
    const user = this.context.user;
    const hud = this.context.hud;
    if (!user) return;

    hud.userCoins.value = user.stats.coins;
    hud.userDist.value = user.stats.dist;

    // A bookmark you own shows the distance it drops you at. The next one along
    // shows what it costs, over the distance you would be buying. The rest show
    // a price you cannot pay yet.
    const owned = user.upgrades.bookmarks;
    hud.bookmarks.forEach((slot, i) => {
      const price = upgradePrice("bookmark", i - 1);
      if (i <= owned) {
        slot.distance.value = i === 0 ? 0 : (user.bookmarks[i - 1] ?? null);
        slot.price.value = null;
        slot.affordable.value = true;
      } else if (i === owned + 1) {
        slot.distance.value = user.bookmarks.length === i ? user.stats.dist : (user.bookmarks[i - 1] ?? null);
        slot.price.value = price;
        slot.affordable.value = price <= user.stats.coins;
      } else {
        slot.distance.value = null;
        slot.price.value = price;
        slot.affordable.value = false;
      }
    });

    UPGRADES.forEach((name, i) => {
      const slot = hud.upgrades[i];
      const level = user.upgrades[name] ?? 0;
      const price = upgradePrice("bookmark", level);
      slot.level.value = level;
      slot.price.value = price;
      slot.affordable.value = price <= user.stats.coins;
    });
  };
}
