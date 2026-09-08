/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { nanoid } from "nanoid";

export class Bubble {
  key = "bubble-" + nanoid(6);
  type = "bubble" as const;

  position = { x: 0, y: 0 };
  radius = 1;

  velocity = { x: 0, y: 0 };

  pull = 1;
  collected = false;
}
