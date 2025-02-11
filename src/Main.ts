/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Context";
import { Terminal } from "./Terminal";
import { StageLoader } from "./StageLoader";
import { Upgrade } from "./Upgrade";
import { LocalStore } from "./LocalStore";
import { ConfigLoader } from "./Config";

export class Main extends Middleware<MainContext> {
  constructor() {
    super();
    this.use(new ConfigLoader());
    this.use(new StageLoader());
    this.use(new LocalStore());
    this.use(new Upgrade());
    this.use(new Terminal());
  }
}
