/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";
import { Middleware } from "polymatic";

import { Format } from "./Format";
import { upgradePrice } from "./Upgrade";
import { type MainContext, UPGRADES } from "./Context";

export class HomePage extends Middleware<MainContext> {
  page: Stage.Node;
  background: Stage.Sprite;

  coins: Stage.Monotype;
  dist: Stage.Monotype;

  bookmarks: BookmarkButton[];
  upgrades: Record<string, UpgradeButton>;

  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("data-save", this.update);
    this.on("data-load", this.update);
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

    this.update();
  };

  setup() {
    if (this.page) return;

    this.page = Stage.component();

    this.page.pin({ align: 0.5 });

    this.page.on("viewport", this.handleViewport);

    this.background = Stage.sprite("homebg");
    this.background.appendTo(this.page);
    this.background.pin("align", 0.5);

    const menu = Stage.column(0.5);
    menu.appendTo(this.page);
    menu.pin("align", 0.5);
    menu.spacing(4);

    const logo = Stage.sprite("logo");
    logo.appendTo(menu);
    logo.pin({ scale: 1.4 });

    const help = Stage.monotype("di");
    help.value("?");
    help.pin({
      alignX: 1,
      alignY: 0,
      handleX: 1,
      handleY: 1,
    });
    help.appendTo(logo);

    help.on(Stage.POINTER_CLICK, () => {
      this.emit("page-set", { name: "help-page" });
    });

    this.dist = Stage.monotype("di");
    this.dist.appendTo(logo);
    this.dist.pin({
      alignX: 0.5,
      alignY: 1,
      offsetX: -3,
      offsetY: -3,
      handleX: 1,
      scale: 0.65,
    });

    this.coins = Stage.monotype("di");
    this.coins.appendTo(logo);
    this.coins.pin({
      alignX: 0.5,
      alignY: 1,
      offsetX: 3,
      offsetY: -3,
      handleX: 0,
      scale: 0.65,
    });

    const row1 = Stage.row(0);
    row1.appendTo(menu);
    row1.spacing(4);

    const row2 = Stage.row(0);
    row2.appendTo(menu);
    row2.spacing(4);

    const row3 = Stage.row(0);
    row3.appendTo(menu);
    row3.spacing(4);

    const row4 = Stage.row(0);
    row4.appendTo(menu);
    row4.spacing(4);

    this.bookmarks = [];
    for (let i = 0; i < 6; i++) {
      const bookmark = i - 1;
      const button = new BookmarkButton();
      button.appendTo(i < 3 ? row1 : row2);
      button.on(Stage.POINTER_CLICK, () => this.handleClickBookmark(bookmark));
      this.bookmarks.push(button);
    }

    this.upgrades = {};
    for (let i = 0; i < 6; i++) {
      const upgrade = UPGRADES[i];
      const button = new UpgradeButton(upgrade);
      button.appendTo(i < 3 ? row3 : row4);
      button.on(Stage.POINTER_CLICK, () => this.handleClickUpgrade(upgrade));
      this.upgrades[upgrade] = button;
    }
    this.update();
  }

  handleClickBookmark = (bookmark: number) => {
    if (bookmark == this.context.user.upgrades.bookmarks) {
      this.emit("user-upgrade", { name: "bookmarks" });
    } else if (bookmark < this.context.user.bookmarks.length) {
      this.emit("page-set", { name: "play-page", bookmark: bookmark });
    }
  };

  handleClickUpgrade = (upgrade: string) => {
    this.emit("user-upgrade", { name: upgrade });
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

  update = () => {
    const user = this.context.user;

    this.dist.value(Format.k(user.stats.dist));
    this.coins.value(Format.coin(user.stats.coins));

    for (let i = 0; i < this.bookmarks.length; i++) {
      const button = this.bookmarks[i];
      const dist = i == 0 ? 0 : user.bookmarks[i - 1];
      const price = upgradePrice("bookmark", i - 1);
      if (i <= user.upgrades.bookmarks) {
        button.setDistance(dist);
      } else if (i == user.upgrades.bookmarks + 1) {
        if (user.bookmarks.length === i) {
          button.setDistance(user.stats.dist);
        }
        button.setPrice(price, price <= user.stats.coins);
      } else {
        button.setPrice(price, false);
      }
    }

    for (let i = 0; i < UPGRADES.length; i++) {
      const name = UPGRADES[i];
      const price = upgradePrice("bookmark", user.upgrades[name] ?? 0);
      const upgrade = this.upgrades[name];
      upgrade.setPrice(user.upgrades[name] ?? 0, price, price <= user.stats.coins);
    }
  };
}

class BookmarkButton extends Stage.Sprite {
  distanceText: Stage.Monotype;
  priceTag: Stage.Monotype;

  constructor() {
    super();
    this.texture("play");
    this.pin("alpha", 0.9);
    this.distanceText = Stage.monotype("d");
    this.distanceText.appendTo(this);
    this.distanceText.pin({
      alignY: 0.5,
      alignX: 0.45,
      handle: 0.5,
      scale: 0.9,
    });

    this.priceTag = Stage.monotype("d");
    this.priceTag.pin({
      align: 1,
      offsetX: -1.6,
      offsetY: -1.4,
      alpha: 0.8,
      scale: 0.6,
    });
    this.priceTag.appendTo(this);
  }

  setDistance(dist: number) {
    this.priceTag.hide();
    this.distanceText.value(typeof dist === "number" ? Format.k(dist) : "");
    this.distanceText.show();
    this.distanceText.alpha(1);
  }

  setPrice(price: number, unlocked: boolean) {
    this.priceTag.value(Format.coin(price));
    this.priceTag.show();
    this.priceTag.alpha(unlocked ? 1 : 0.5);
    this.distanceText.alpha(0.5);
  }
}

class UpgradeButton extends Stage.Sprite {
  levelTag: Stage.Monotype;
  priceTag: Stage.Monotype;
  upgradeImage: Stage.Sprite;

  constructor(name: string) {
    super();
    this.texture("option");

    this.upgradeImage = Stage.sprite("up_" + name);
    this.upgradeImage.pin("align", 0.5);
    this.upgradeImage.appendTo(this);

    // price
    this.priceTag = Stage.monotype("d");
    this.priceTag.pin({
      align: 1,
      offsetX: -1.6,
      offsetY: -1.4,
      alpha: 0.5,
      scale: 0.6,
    });
    this.priceTag.appendTo(this);

    // level
    this.levelTag = Stage.monotype("up");
    this.levelTag.pin({
      alignX: 0,
      alignY: 0,
      offsetX: 1.6,
      offsetY: 1.4,
      alpha: 1,
      scale: 0.6,
    });
    this.levelTag.appendTo(this);
  }

  setPrice(level: number, price: number, unlocked: boolean) {
    this.pin("alpha", 0.9);
    this.priceTag.value(Format.coin(price));
    if (level <= 6) {
      this.levelTag.value(level);
    }
    this.upgradeImage.alpha(unlocked ? 1 : 0.7);
    this.priceTag.alpha(unlocked ? 1 : 0.5);
  }
}
