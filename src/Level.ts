/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { Calc } from "./Calc";

import { LevelData, type MainContext } from "./Context";
import { Coin } from "./Coin";
import { Enemy } from "./Enemy";
import { Power } from "./Power";
import { Bubble } from "./Bubble";
import { Player } from "./Player";
import { RandomPower } from "./RandomPower";
import { RandomPattern } from "./RandomPattern";
import { RandomCoin } from "./RandomCoin";
import { RandomEnemy } from "./RandomEnemy";
import { Gamepad } from "./Gamepad";

type Entity = Enemy | Power | Coin | Bubble;

export class Level extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("deactivate", this.handleDeactivate);

    this.on("terminal-tick", this.handleTick);

    this.on("insert-bubble", this.handleInsert);
    this.on("insert-enemy", this.handleInsert);
    this.on("insert-coin", this.handleInsert);
    this.on("insert-power", this.handleInsert);

    this.on("delete-entity", this.handleDelete);

    this.on("physics-collide", this.handleCollide);
    this.on("player-die", this.handlePlayerDie);

    this.use(new Gamepad());
    this.use(new RandomPattern());
    this.use(new RandomCoin());
    this.use(new RandomEnemy());
    this.use(new RandomPower());
  }

  inserted: Entity[] = [];
  deleted = new Set<Entity>();

  startBookmark: number = -1;
  startDist: number = 0;

  handleActivate() {
    this.startLevel();
  }

  startLevel() {
    this.context.level = new LevelData();

    // this.context.level.width = Config.width;
    // this.context.level.height = Config.height;

    const bookmark = this.context.page.bookmark;
    const dist = this.context.user.bookmarks[bookmark];
    this.startDist = dist > 0 ? dist : 0;
    this.startBookmark = dist > 0 ? bookmark : -1;

    this.context.level.coins = 0;
    this.context.level.power = 0;
    this.context.level.oxygen = 1;

    this.context.level.speed = this.context.config.speed;
    this.context.level.dist = this.startDist;

    const x = 0;
    const y = this.context.config.height / 5 + this.context.level.dist;

    this.context.level.player = new Player();
    this.context.level.player.upgrade(this.context.user.upgrades);
    this.context.level.player.x = x;
    this.context.level.player.y = y;

    this.context.level.cursor = {
      x: x,
      y: y,
      speed: this.context.level.player.speed,
    };

    this.emit("level-start");
  }

  handleDeactivate() {
    this.context.level = null;
  }

  handlePlayerDie = () => {
    if (this.context.level.player.dead) return;
    this.endLevel(/*{ die: true }*/);
  };

  endLevel = () => {
    const { user, level } = this.context;

    level.player.dead = true;
    level.speed = 0;

    this.emit("insert-bookmark", {
      dist: level.dist,
      index: this.startBookmark + 1,
    });

    // todo: move this to Upgrade
    if (level.dist > user.stats.dist) {
      user.stats.dist = level.dist;
    }
    user.stats.coins += level.coins;

    this.emit("data-save");
    this.emit("level-end");
  };

  handleInsert = (entity: Entity) => {
    this.inserted.push(entity);
  };

  handleDelete = (entity: Entity) => {
    this.deleted.add(entity);
  };

  handleTick = (dtms: number) => {
    // limit max delta time to 100ms
    dtms = Math.min(dtms, 100);
    // convert ms to seconds
    const dts = dtms / 1000;

    const level = this.context.level;
    const player = level.player;

    for (let i = this.inserted.length - 1; i >= 0; i--) {
      const obj = this.inserted[i];
      if (obj.position.y + (obj.radius || 0) < level.dist + this.context.config.height) {
        this.inserted.splice(i, 1);
        level.objects.push(obj);
      }
    }

    for (let i = level.objects.length - 1; i >= 0; i--) {
      const obj = level.objects[i];

      if (level.power > 0 && obj.type === "enemy") {
        obj.weak = true;
      }

      if (obj.position.y - (obj.radius || 0) < level.dist) {
        level.objects.splice(i, 1);
        continue;
      }

      if ("velocity" in obj) {
        obj.position.x += dts * obj.velocity.x;
        obj.position.y += dts * obj.velocity.y;
      }

      if (player.dead) continue;

      let dx = obj.position.x - player.x;
      let dy = obj.position.y - player.y;
      let dxy = Calc.lengthOf(dx, dy);

      if (player.pull && "pull" in obj) {
        const p = player.pull * obj.pull;
        const f = (p * 5000) / dxy / dxy / dxy;
        const r = Math.min(1, f * dts);
        obj.position.x -= dx * r;
        obj.position.y -= dy * r;
      }

      if (player.push && "push" in obj && "weak" in obj && !obj.weak) {
        const p = player.push * obj.push;
        const f = (p * 0.3) / (1 + Math.pow(1.1, dxy - 10 * (p + 1)));
        const r = Math.min(1, f * dts);
        obj.position.x += dx * r;
        obj.position.y += dy * r;
      }

      dx = obj.position.x - player.x;
      dy = obj.position.y - player.y;
      dxy = Calc.lengthOf(dx, dy);

      if (dxy < obj.radius + player.radius) {
        this.emit("physics-collide", { player: player, obj });
      }
    }

    for (let i = level.objects.length - 1; i >= 0; i--) {
      const obj = level.objects[i];
      if (this.deleted.has(obj)) {
        this.deleted.delete(obj);
        level.objects.splice(i, 1);
      }
    }

    if (player.dead) return;

    // delta distance
    const dd = dts * (level.speed + level.dist * this.context.config.acceleration);
    level.dist += dd;

    level.power = Math.max(0, level.power - dd);
    level.oxygen = Math.max(0, level.oxygen - dd * player.oxygen);

    let px = player.x;
    let py = player.y;

    if (level.cursor.fresh) {
      const dx = level.cursor.x - px;
      const dy = level.cursor.y - py;
      let dxy = Calc.lengthOf(dx, dy);
      if (dxy < 0.1) {
        level.cursor.fresh = false;
      }
      dxy = Math.max(1, dxy / level.cursor.speed / dtms);
      px += dx / dxy;
      py += dy / dxy;
    }
    level.cursor.y += dd;
    py += dd;

    player.x = px;
    player.y = py;

    this.emit("level-step");

    if (!player.dead && level.oxygen <= 0) {
      this.emit("player-die");
    }
  };

  handleCollide = ({ player, obj }: { player: Player; obj: Enemy | Power | Coin | Bubble }) => {
    if (obj.type === "bubble") {
      this.collideBubble(player, obj as Bubble);
    } else if (obj.type === "enemy") {
      this.collideEnemy(player, obj as Enemy);
    } else if (obj.type === "power") {
      this.collidePower(player, obj as Power);
    } else if (obj.type === "coin") {
      this.collideCoin(player, obj as Coin);
    }
  };

  collideEnemy = (player: Player, enemy: Enemy) => {
    if (player.dead) {
      // already dead
    } else if (enemy.collected) {
      // enemy dead
    } else if (enemy.weak) {
      enemy.push = 0;
      enemy.collected = true;
      enemy.velocity.x = 0;
      enemy.velocity.y = 0;
      this.context.level.stats.enemies[enemy.name] += 1;
      this.emit("enemy-collected", enemy);
    } else {
      this.emit("player-die");
    }
  };

  collideBubble = (player: Player, bubble: Bubble) => {
    this.context.level.oxygen = Math.min(1.5, this.context.level.oxygen + 0.01);
    bubble.collected = true;
    this.context.level.stats.bubbles += 1;
    this.emit("delete-entity", bubble);
  };

  collideCoin = (player: Player, coin: Coin) => {
    this.context.level.coins += coin.value;
    coin.collected = true;
    this.context.level.stats.coins[coin.value] += 1;
    this.emit("delete-entity", coin);
  };

  collidePower = (player: Player, power: Power) => {
    this.context.level.power = Math.max(this.context.level.player.power, this.context.level.power);
    power.collected = true;
    this.context.level.stats.power += 1;
    this.emit("delete-entity", power);
  };
}
