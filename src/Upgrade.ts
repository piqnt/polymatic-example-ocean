/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";

export const upgradePrice = (name: string, level: number) => Math.pow(10, level + 2);

export class Upgrade extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("user-upgrade", this.handleUserUpgrade);
    this.on("insert-bookmark", this.handleInsertBookmark);
  }

  handleInsertBookmark = ({ dist, index }: { dist: number; index: number }) => {
    const bookmarks = this.context.user.bookmarks;
    const capacity = this.context.user.upgrades.bookmarks;

    // remove bookmark that are less or equal to make space
    let removed = false;
    while (index < bookmarks.length && bookmarks[index] <= dist) {
      bookmarks.splice(index, 1);
      removed = true;
    }
    if (removed) {
      // if we removed any bookmarks, insert the new one
      bookmarks.splice(index, 0, dist);
    } else if (index >= bookmarks.length && bookmarks.length <= capacity + 1) {
      // if we are at the end of the array and there is space, append the new bookmark
      bookmarks.push(dist);
    }
  };

  handleUserUpgrade = (up: { name: string }) => {
    if ("name" in up) {
      const price = upgradePrice(up.name, this.context.user.upgrades[up.name]);
      const isValid = typeof this.context.user.upgrades[up.name] === "number";
      if (!isValid) {
        console.log("invalid upgrade name", up.name);
        return;
      }
      const canAfford = price > 0 && price <= this.context.user.stats.coins;
      if (!canAfford) {
        console.log("cannot afford upgrade", up.name, price, this.context.user.stats.coins);
        return;
      }
      this.context.user.stats.coins -= price;
      this.context.user.upgrades[up.name] += 1;

      this.emit("data-save");
      this.emit("data-load");
    }
  };
}
