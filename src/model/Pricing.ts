/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * What the next level of an upgrade costs. Shared: runtime/Upgrade charges it,
 * and the hud prices the buttons with it.
 */
export const upgradePrice = (name: string, level: number) => Math.pow(10, level + 2);
