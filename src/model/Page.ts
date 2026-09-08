/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Which page is up, and for the play page which bookmark it starts from. */
export interface PageConfig {
  name: string;
  bookmark?: number;
}
