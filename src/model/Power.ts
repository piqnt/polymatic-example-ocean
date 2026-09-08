/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { nanoid } from "nanoid";

export class Power {
  key = "power-" + nanoid(6);
  type = "power" as const;

  position = { x: 0, y: 0 };
  radius = 5;
  pull = 0.1;
  collected = false;
}
