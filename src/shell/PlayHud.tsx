/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from "preact/hooks";

import { Format } from "../model";
import { RiCopperCoinLine } from "react-icons/ri";
import { TbMapPin } from "react-icons/tb";

import { useRuntime } from "./context";
import { atlasStyle, COIN_SCALE, coinIcon } from "./atlas";
import styles from "./Shell.module.css";

/** The readouts around the run: air, power, distance, coins, and coin pickups. */
export function PlayHud() {
  return (
    <div class={styles.playHud}>
      <Bars />
      <Coins />
      <Dist />
      <LastCoin />
    </div>
  );
}

function Bars() {
  const { oxygenWidth, oxygenLow, powerWidth } = useRuntime().context.hud;
  // the sprite bars were sized value + 5 and hidden once the value ran out
  const oxygen = oxygenWidth.value;
  const power = powerWidth.value;

  return (
    <>
      {oxygen > 0 && (
        <span
          class={`${styles.bar} ${styles.oxygen} ${oxygenLow.value ? styles.oxygenLow : ""}`}
          style={{ width: `calc(var(--u) * ${oxygen + 5})` }}
        />
      )}
      {power > 0 && (
        <span class={`${styles.bar} ${styles.powerup}`} style={{ width: `calc(var(--u) * ${power + 5})` }} />
      )}
    </>
  );
}

function Coins() {
  const { coins } = useRuntime().context.hud;
  return (
    <span class={`${styles.coins} ${styles.stat}`} aria-label="Coins">
      <RiCopperCoinLine aria-hidden size="1em" />
      <span>{Format.coin(coins.value)}</span>
    </span>
  );
}

function Dist() {
  const { dist } = useRuntime().context.hud;
  return (
    <span class={`${styles.dist} ${styles.stat}`} aria-label="Distance">
      <TbMapPin aria-hidden size="1em" />
      <span>{Format.distance(dist.value)}</span>
    </span>
  );
}

/**
 * The coin just picked up, held on screen for a second. The nonce is what makes
 * a second coin of the same value restart the second.
 */
function LastCoin() {
  const { lastCoin, lastCoinNonce } = useRuntime().context.hud;
  const value = lastCoin.value;
  const nonce = lastCoinNonce.value;
  const [shownNonce, setShownNonce] = useState(0);

  useEffect(() => {
    if (!nonce) return;
    const timeout = setTimeout(() => setShownNonce(nonce), 1000);
    return () => clearTimeout(timeout);
  }, [nonce]);

  if (!value || nonce === shownNonce) return null;

  return (
    <span class={styles.lastCoin}>
      <span class={styles.sprite} style={atlasStyle(coinIcon(value), COIN_SCALE[value] ?? 1)} />
      {value > 100 && <span>{Format.coin(value)}</span>}
    </span>
  );
}
