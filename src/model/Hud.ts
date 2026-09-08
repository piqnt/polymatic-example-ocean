/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type Signal, signal } from "@preact/signals";

import { UPGRADES } from "./Upgrades";

/**
 * One of the six bookmark buttons on the menu. A bookmark either shows the
 * distance it starts you at, or a price to unlock - and the one you are about
 * to buy shows both, with the distance dimmed.
 */
export interface BookmarkSlot {
  /** the bookmark this button plays, -1 being the start of the run */
  bookmark: number;
  distance: Signal<number | null>;
  price: Signal<number | null>;
  affordable: Signal<boolean>;
}

/** One of the six upgrade buttons: its icon, the level you are on, its price. */
export interface UpgradeSlot {
  name: string;
  level: Signal<number>;
  price: Signal<number>;
  affordable: Signal<boolean>;
}

/**
 * Everything the hud draws, mirrored out of the game state by
 * runtime/HudManager - the level readouts once per frame, the menu's numbers
 * whenever the saved data changes. The shell reads only these; it never
 * touches `context.level` or `context.user`.
 *
 * The slots are created once and never replaced, so refreshing one button's
 * price re-renders one button rather than the whole menu.
 */
export class HudData {
  // --- the run ---

  coins: Signal<number>;
  dist: Signal<number>;

  /** bar widths in stage units, the way the sprite bars were sized */
  oxygenWidth: Signal<number>;
  oxygenLow: Signal<boolean>;
  powerWidth: Signal<number>;

  /** the coin just picked up, and a counter so picking the same value again still shows */
  lastCoin: Signal<number | null>;
  lastCoinNonce: Signal<number>;

  // --- the menu ---

  userCoins: Signal<number>;
  userDist: Signal<number>;

  bookmarks: BookmarkSlot[];
  upgrades: UpgradeSlot[];

  constructor() {
    this.coins = signal(0);
    this.dist = signal(0);

    this.oxygenWidth = signal(0);
    this.oxygenLow = signal(false);
    this.powerWidth = signal(0);

    this.lastCoin = signal<number | null>(null);
    this.lastCoinNonce = signal(0);

    this.userCoins = signal(0);
    this.userDist = signal(0);

    this.bookmarks = [];
    for (let i = 0; i < 6; i++) {
      this.bookmarks.push({
        bookmark: i - 1,
        distance: signal<number | null>(null),
        price: signal<number | null>(null),
        affordable: signal(false),
      });
    }

    this.upgrades = UPGRADES.map((name) => ({
      name,
      level: signal(0),
      price: signal(0),
      affordable: signal(false),
    }));
  }
}
