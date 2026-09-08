/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type BookmarkSlot } from "../model";
import { type GameRuntime } from "./context";

// Everything a control can do, in one file. Components call these; they never
// emit an event or set a signal inline.

/** @action */
export function openHelp({ context }: GameRuntime) {
  context.helpOpen.value = true;
}

/** @action */
export function closeHelp({ context }: GameRuntime) {
  context.helpOpen.value = false;
}

/**
 * A bookmark button either buys the next bookmark slot or starts a run from the
 * one it holds - the same rule the sprite menu played by.
 */
/** @action */
export function pickBookmark(runtime: GameRuntime, slot: BookmarkSlot) {
  const { context, emit } = runtime;
  const user = context.user;
  if (!user) return;

  if (slot.bookmark === user.upgrades.bookmarks) {
    emit("user-upgrade", { name: "bookmarks" });
  } else if (slot.bookmark < user.bookmarks.length) {
    emit("page-set", { name: "play-page", bookmark: slot.bookmark });
  }
}

/** @action */
export function buyUpgrade({ emit }: GameRuntime, name: string) {
  emit("user-upgrade", { name });
}
