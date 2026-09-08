/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type * as Stage from "stage-js";
import { type Signal, signal } from "@preact/signals";

import { type UserData } from "./Upgrades";
import { type LevelData } from "./LevelData";
import { type PageConfig } from "./Page";
import { type Config } from "./Config";
import { HudData } from "./Hud";

/**
 * Global context, shared between the runtime and the shell.
 *
 * The plain fields belong to the runtime - the stage, the run, the saved user
 * data - and are written many times a frame. The signals are the bridge: the
 * runtime writes them, the shell subscribes by reading `.value` as it renders.
 * Displayed values are mirrored onto `hud` by runtime/HudManager, per frame for
 * the run and on every save or load for the menu, so the shell re-renders when
 * a number it draws changes rather than on every frame.
 */
export class MainContext {
  stage?: Stage.Root;
  user?: UserData;
  level?: LevelData;
  config: typeof Config;

  // --- shell facing state ---

  /** atlas loaded and the stage mounted; the shell draws nothing before this */
  ready: Signal<boolean>;

  /** which page is up - the shell renders the menu or the play hud off this */
  page: Signal<PageConfig>;

  /** the how-to-play modal, which is a modal rather than a page of its own */
  helpOpen: Signal<boolean>;

  hud: HudData;

  constructor() {
    this.ready = signal(false);
    this.page = signal<PageConfig>({ name: "home-page" });
    this.helpOpen = signal(false);
    this.hud = new HudData();
  }
}
