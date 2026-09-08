/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { nanoid } from "nanoid";

export class Enemy {
  key = "enemy-" + nanoid(6);
  type = "enemy" as const;

  name: string;

  position = { x: 0, y: 0 };

  radius = 5;
  push = 1;

  velocity = { x: 0, y: 0 };

  weak = false;
  collected = false;

  constructor(name: string) {
    this.name = name;
  }
}
