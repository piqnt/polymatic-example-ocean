/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { nanoid } from "nanoid";

export class Coin {
  key = "coin-" + nanoid(6);
  type = "coin" as const;

  position = { x: 0, y: 0 };
  radius = 6;

  value: number;
  collected = false;

  constructor(value: number) {
    this.value = value;
  }
}
