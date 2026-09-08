/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import "./fonts.css";

import { GameContext } from "./context";
import { runtime } from "../async-signals";
import { HomePage } from "./HomePage";
import { PlayHud } from "./PlayHud";
import { HelpModal } from "./HelpModal";
import styles from "./Shell.module.css";

/**
 * The shell. It mounts before the runtime exists (see index.tsx), so every read
 * below is guarded: `runtime` fills in once the game has been activated, and
 * `ready` once the atlas is loaded and the stage is mounted.
 */
export function App() {
  const context = runtime.value?.context;
  const ready = context?.ready.value;
  const page = context?.page.value.name;
  const help = context?.helpOpen.value;

  return (
    <GameContext.Provider value={runtime.value ?? null}>
      <div class={styles.frame}>
        {runtime.value && ready && page === "home-page" && <HomePage />}
        {runtime.value && ready && page === "play-page" && <PlayHud />}
        {runtime.value && help && <HelpModal />}
      </div>
    </GameContext.Provider>
  );
}
