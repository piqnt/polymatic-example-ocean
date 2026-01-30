/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { Middleware, Binder, Driver, Memo } from "polymatic";

import { type Player } from "./Player";
import { type Bubble } from "./Bubble";
import { type Power } from "./Power";
import { type Coin } from "./Coin";
import { type Enemy } from "./Enemy";
import { Level } from "./Level";
import { Format } from "./Format";
import { type MainContext } from "./Context";

const COIN_SCALE = {
  "1": 0.7 * 1,
  "2": 0.75 * 1,
  "5": 0.8 * 1,
  "10": 0.9 * 1,
  "20": 0.95 * 1,
  "50": 1 * 1,
  "100": 1.1 * 1,
};

export class LevelPage extends Middleware<MainContext> {
  page: Stage.Node;

  viewbox: Stage.Node;
  cursor: Stage.Sprite;
  bubbles: Stage.Node;
  items: Stage.Node;
  player: Stage.Node;

  oxygen: Bar;
  powerup: Bar;
  dist: Stage.Monotype;
  coins: Stage.Monotype;

  lastCoin: LastCoin;

  bg: Stage.Sprite;
  border: Stage.Sprite;

  top: Stage.Sprite;

  constructor() {
    super();

    this.use(new Level());

    this.on("activate", this.handleActivate);
    this.on("deactivate", this.handleDeactivate);
    this.on("frame-render", this.handleFrameRender);
    this.on("level-end", this.handleLevelEnd);
  }

  handleActivate = () => {
    this.setup();

    const stage = this.context.stage;
    stage.empty();
    stage.append(this.page);
    if (stage.dom?.style) {
      stage.dom.style.cursor = "none";
    }

    stage.background(randomBackgroundColor());
    this.handleViewport();

    this.page.pin("alpha", 0);
    this.page.show();
    this.page.tween(200).pin("alpha", 1);
  };

  handleDeactivate = () => {
    const stage = this.context.stage;
    if (stage.dom?.style) {
      stage.dom.style.cursor = "";
    }
    this.page.remove();
  };

  handleLevelEnd = () => {
    // game.end();
    this.page
      .tween(1000)
      // .pin("alpha", 0)
      .hide()
      .done(() => {
        this.emit("page-set", { name: "home-page" });
      });
  };

  setup() {
    this.page = Stage.component();

    this.page.pin({ align: 0.5 });

    this.page.on("viewport", this.handleViewport);

    this.bg = Stage.sprite("playbg");
    this.bg.appendTo(this.page);
    this.bg.pin("align", 0.5);

    this.border = Stage.sprite("border");
    this.border.stretch();
    this.border.appendTo(this.page);
    this.border.pin({
      width: this.context.config.width,
      height: this.context.config.height,
      align: 0.5,
      alpha: 0.5,
    });

    this.top = Stage.sprite("shadow");
    this.top.stretch();
    this.top.appendTo(this.page);

    this.viewbox = Stage.component();
    this.viewbox.appendTo(this.page);
    this.viewbox.attr("spy", true);
    this.viewbox.pin({
      width: this.context.config.width,
      height: this.context.config.height,
      alignX: 0.5,
      alignY: 0.5,
      handleX: 0,
      scaleY: -1,
    });

    this.oxygen = new Bar("oxygen");
    this.oxygen.appendTo(this.page);
    this.oxygen.pin({
      alignX: 1,
      alignY: 0,
      offsetX: -3,
      offsetY: 2,
    });

    this.powerup = new Bar("powerup");
    this.powerup.appendTo(this.page);
    this.powerup.pin({
      alignX: 1,
      alignY: 0,
      offsetX: -3,
      offsetY: 8,
    });

    this.dist = Stage.monotype("d");
    this.dist.appendTo(this.page);
    this.dist.pin({
      alignX: 0,
      alignY: 0,
      offsetX: 3,
      offsetY: 11,
      handleX: 0,
    });

    this.coins = Stage.monotype("d");
    this.coins.appendTo(this.page);
    this.coins.pin({
      alignX: 0,
      alignY: 0,
      offsetX: 3,
      offsetY: 3,
    });

    this.lastCoin = new LastCoin();
    this.lastCoin.appendTo(this.page);
    this.lastCoin.pin({
      alignX: 0.5,
      alignY: 0,
      offsetX: 10,
      offsetY: 2,
    });
    this.lastCoin.hide();

    this.cursor = Stage.sprite("cursor");
    this.cursor.pin("handle", 0.5);
    this.cursor.appendTo(this.viewbox);
    // this.cursor.hide();

    this.bubbles = Stage.component().appendTo(this.viewbox);
    this.items = Stage.component().appendTo(this.viewbox);
    this.player = Stage.component().appendTo(this.viewbox);

    this.viewbox.on(Stage.POINTER_MOVE, this.handlePointerMove);
    this.viewbox.on(Stage.POINTER_DOWN, this.handlePointerDown);
  }

  handleViewport = () => {
    this.page.pin({
      width: this.page.parent().pin("width"),
      height: this.page.parent().pin("height"),
    });

    this.bg.pin({
      scaleMode: "out",
      scaleWidth: this.page.pin("width"),
      scaleHeight: this.page.pin("height"),
    });

    const topHeight = this.context.config.notch / this.page.pin("scaleX") / this.page.parent().pin("scaleX");

    this.top.pin({
      width: this.page.pin("width"),
      height: topHeight,
      offsetY: -topHeight,
    });
  };

  handlePointerMove = (point) => {
    this.emit("user-pointer", point);
    // this.cursor.offset(point).visible(visible);
  };

  handlePointerDown = (point) => {
    this.emit("user-pointer", point);
    // this.cursor.offset(point).visible(visible);
  };

  handleFrameRender = () => {
    const level = this.context.level;
    this.coins.value(Format.coin(level.coins));
    this.oxygen.setValue(level.oxygen * 25, level.oxygen < 0.35);
    this.powerup.setValue(level.power / 30);
    this.dist.value(Format.k(level.dist));
    this.viewbox.pin("offsetY", level.dist);
    this.cursor.offset(level.cursor);
    this.binder.data([level.player, ...level.objects]);
  };

  playerDriver = Driver.create<Player, { ui: Stage.Anim; memo: Memo }>({
    filter: (d) => d.type === "player",
    enter: (player) => {
      const ui = Stage.anim(player.name + "_alive");
      ui.pin("handle", 0.5);
      ui.appendTo(this.player);
      ui.scale(1, -1);
      ui.play();
      return { ui: ui, memo: Memo.init() };
    },
    update: (player, { ui, memo }) => {
      if (memo.update(player.dead)) {
        ui.frames(player.name + (player.dead ? "_dead" : "_alive"));
        ui.repeat(1);
        ui.scale(1, -1);
      }
      ui.offset(player);
    },
    exit: (player, { ui, memo }) => {
      ui.remove();
    },
  });

  enemyDriver = Driver.create<Enemy, { ui: Stage.Anim; memo: Memo }>({
    filter: (d) => d.type === "enemy",
    enter: (enemy) => {
      const ui = Stage.anim(enemy.name + "_alive");
      ui.play();
      ui.pin("handle", 0.5);
      ui.appendTo(this.items);
      const mirror = enemy.velocity && enemy.velocity.x > 0;
      ui.scale(mirror ? -1 : 1, -1);

      return { ui, memo: Memo.init() };
    },
    exit: (enemy, { ui, memo }) => {
      ui.remove();
    },
    update: (enemy, { ui, memo }) => {
      ui.offset(enemy.position);

      if (memo.update(enemy.weak, enemy.collected)) {
        if (enemy.collected) {
          ui.frames(enemy.name + "_dead");
          ui.gotoFrame(0);
          ui.pin({ alpha: 0.8, rotation: 0 });
        } else if (enemy.weak) {
          ui.frames(enemy.name + "_weak");
          ui.gotoFrame(0);
        } else {
          ui.frames(enemy.name + "_alive");
          ui.gotoFrame(0);
        }
      }
    },
  });

  powerDriver = Driver.create<Power, Stage.Sprite>({
    filter: (d) => d.type === "power",
    enter: (power) => {
      const ui = Stage.sprite("power");
      ui.pin("handle", 0.5);
      ui.appendTo(this.items);
      return ui;
    },
    exit: (power, ui) => {
      if (power.collected) {
        ui.tween(100).scale(5, 5).alpha(0.2).tween(800).scale(100, 100).alpha(0).remove();
      } else {
        ui.remove();
      }
    },
    update: (power, ui) => {
      ui.offset(power.position);
    },
  });

  coinDriver = Driver.create<Coin, Stage.Sprite>({
    filter: (d) => d.type === "coin",
    enter: (coin) => {
      const scale = COIN_SCALE[coin.value] || 1;
      const ui = Stage.sprite("coin_" + coin.value);
      ui.pin("handle", 0.5);
      ui.appendTo(this.items);
      ui.scale(scale, -scale);
      return ui;
    },
    update: (coin, ui) => {
      ui.offset(coin.position);
    },
    exit: (coin, ui) => {
      if (coin.collected) {
        this.lastCoin.setCoin(coin.value, 1000);
        const x = ui.pin("offsetX");
        const y = ui.pin("offsetY");
        const speed = this.context.level.speed;
        ui.tween(200)
          .offset(x, y + speed * 0.2)
          .scale(2, -2)
          .tween(200)
          .offset(x, y + speed * 0.4)
          .scale(3, 3)
          .alpha(0)
          .remove();
      } else {
        ui.remove();
      }
    },
  });

  bubbleDriver = Driver.create<Bubble, Stage.Sprite>({
    filter: (d) => d.type === "bubble",
    enter: (bubble) => {
      const ui = Stage.sprite("bubble");
      ui.pin("handle", 0.5);
      ui.appendTo(this.bubbles);
      ui.show();
      return ui;
    },
    update: (bubble, ui) => {
      ui.offset(bubble.position);
    },
    exit: (bubble, ui) => {
      ui.remove();
    },
  });

  binder = Binder.create<Bubble | Power | Coin | Enemy | Player>({
    key: (d) => d.key,
    drivers: [this.playerDriver, this.enemyDriver, this.powerDriver, this.coinDriver, this.bubbleDriver],
  });
}

export const randomBackgroundColor = randomize([
  "#f2f2f2",
  "#e1e1e1",
  "#ff5a82",
  "#ff5555",
  "#db4cf4",
  "#ff4edc",
  "#7d7de8",
  "#a163ff",
  "#5ba2dd",
  "#00b2de",
  "#56dc8b",
  "#62d962",
  "#a0f667",
  "#d6ff36",
  "#ecff24",
  "#fffe34",
  "#ffda3e",
  "#ffb843",
]);

function randomize<T>(list: T[]) {
  // shuffle
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  let i = 0;
  return () => {
    return list[i++ % list.length];
  };
}

class Bar extends Stage.Sprite {
  warn = false;
  constructor(sprite: string) {
    super();
    this.texture(sprite);
    this.stretch();
    this.tick((dt, t) => {
      this.alpha(this.warn ? Math.sin(t / 100) * 0.5 + 0.5 : 1);
    });
  }

  setValue(value: number, warn: boolean = false) {
    this.warn = warn;
    this.pin("width", Math.max(0, value) + 5);
    this.visible(value > 0);
  }
}

class LastCoin extends Stage.Component {
  coinImage: Stage.Sprite;
  coinValue: Stage.Monotype;
  timeout: any;

  constructor() {
    super();
    this.column(0.5);

    this.coinImage = Stage.sprite();
    this.coinImage.appendTo(this);

    this.coinValue = Stage.monotype("d");
    this.coinValue.pin("scale", 0.8);
    this.coinValue.appendTo(this);

    this.hide();
  }

  setCoin = (value: number, time: number) => {
    const scale = COIN_SCALE[value];
    this.coinImage.texture("coin_" + value).pin("scale", scale || 1);
    this.coinValue.value(Format.coin(value)).visible(value > 100);

    this.show();
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.hide(), time);
  };
}
