/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRuntime } from "./context";
import { closeHelp } from "./actions";
import styles from "./Shell.module.css";

/**
 * How to play. This used to be a <dialog> written into index.html and opened by
 * a page middleware; it is a modal on `context.helpOpen` now, so the menu stays
 * up behind it and nothing swaps out to show it.
 */
export function HelpModal() {
  const runtime = useRuntime();

  return (
    <div class={styles.backdrop} onClick={() => closeHelp(runtime)}>
      <div class={styles.dialog} role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
        <button type="button" class={styles.close} aria-label="close" onClick={() => closeHelp(runtime)}>
          ✕
        </button>

        <h3>How to play</h3>
        <ul>
          <li>Collect bubbles (small circles) to fill up your oxygen</li>
          <li>Avoid other live species, else die</li>
          <li>Collect power-ups (large circles) to be able to eat other species</li>
          <li>Collect coins and other valuable items to buy upgrades</li>
        </ul>

        <h3>Upgrades</h3>
        <ul>
          <li>Pull bubbles</li>
          <li>Move around faster</li>
          <li>Push enemies</li>
          <li>Longer oxygen usage</li>
          <li>Longer power-up</li>
          <li>Reduce game speed</li>
        </ul>

        <h3>Collectible items</h3>
        <ul>
          <li>Coins: 1-100 coins</li>
          <li>Small diamond: 1k coins, distance 5k+</li>
          <li>Large diamond: 10k coins, distance 7k+</li>
          <li>Key: 100k coins, distance 10k+</li>
          <li>Crown: 1M coins, distance 15k+</li>
        </ul>

        <p>
          Ocean is an open-source game made with Polymatic framework. Check out the{" "}
          <a href="https://github.com/piqnt/polymatic-example-ocean" target="_blank" rel="noreferrer">
            project github repository
          </a>{" "}
          for more information.
        </p>
      </div>
    </div>
  );
}
