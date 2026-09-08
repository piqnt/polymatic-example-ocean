/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type BookmarkSlot, type UpgradeSlot, Format } from "../model";
import { RiCopperCoinLine } from "react-icons/ri";
import { TbHelp, TbMapPin } from "react-icons/tb";

import { useRuntime } from "./context";
import { buyUpgrade, openHelp, pickBookmark } from "./actions";
import { atlasStyle, LOGO, OPTION_PLATE, PLAY_PLATE, upgradeIcon } from "./atlas";
import styles from "./Shell.module.css";

/**
 * The menu: the logo with what you have earned, six bookmarks to start a run
 * from, and six upgrades to spend on. The artwork behind it is still drawn on
 * the stage (runtime/HomeBackdrop).
 */
export function HomePage() {
  const runtime = useRuntime();
  const { bookmarks, upgrades } = runtime.context.hud;

  return (
    <div class={styles.menu}>
      <div class={`${styles.sprite} ${styles.logo}`} style={atlasStyle(LOGO, 1.4)}>
        <button type="button" class={styles.help} aria-label="How to play" onClick={() => openHelp(runtime)}>
          <TbHelp aria-hidden size="1em" />
        </button>
        <LogoStats />
      </div>

      <div class={styles.row}>
        {bookmarks.slice(0, 3).map((slot) => (
          <Bookmark key={slot.bookmark} slot={slot} />
        ))}
      </div>
      <div class={styles.row}>
        {bookmarks.slice(3).map((slot) => (
          <Bookmark key={slot.bookmark} slot={slot} />
        ))}
      </div>

      <div class={styles.row}>
        {upgrades.slice(0, 3).map((slot) => (
          <Upgrade key={slot.name} slot={slot} />
        ))}
      </div>
      <div class={styles.row}>
        {upgrades.slice(3).map((slot) => (
          <Upgrade key={slot.name} slot={slot} />
        ))}
      </div>
    </div>
  );
}

function LogoStats() {
  const { userDist, userCoins } = useRuntime().context.hud;
  return (
    <span class={styles.logoStats}>
      <span class={styles.stat} aria-label="Distance">
        <TbMapPin aria-hidden size="1em" />
        <span>{Format.distance(userDist.value)}</span>
      </span>
      <span class={styles.stat} aria-label="Coins">
        <RiCopperCoinLine aria-hidden size="1em" />
        <span>{Format.coin(userCoins.value)}</span>
      </span>
    </span>
  );
}

/**
 * One bookmark. Each reads its own signals, so buying an upgrade re-renders the
 * buttons whose price changed rather than the whole menu.
 */
function Bookmark({ slot }: { slot: BookmarkSlot }) {
  const runtime = useRuntime();
  const distance = slot.distance.value;
  const price = slot.price.value;
  const affordable = slot.affordable.value;

  return (
    <button
      type="button"
      class={`${styles.sprite} ${styles.plate}`}
      style={atlasStyle(PLAY_PLATE)}
      aria-label={price !== null ? "Unlock bookmark" : "Play from here"}
      onClick={() => pickBookmark(runtime, slot)}
    >
      {distance !== null && (
        <span class={`${styles.bookmarkDistance} ${price !== null ? styles.dimmed : ""}`}>
          {Format.distance(distance)}
        </span>
      )}
      {price !== null && (
        <span class={`${styles.priceTag} ${styles.stat} ${affordable ? "" : styles.unaffordable}`}>
          <RiCopperCoinLine aria-hidden size="1em" />
          <span>{Format.coin(price)}</span>
        </span>
      )}
    </button>
  );
}

function Upgrade({ slot }: { slot: UpgradeSlot }) {
  const runtime = useRuntime();
  const level = slot.level.value;
  const affordable = slot.affordable.value;

  return (
    <button
      type="button"
      class={`${styles.sprite} ${styles.plate}`}
      style={atlasStyle(OPTION_PLATE)}
      aria-label={`Upgrade ${slot.name}`}
      onClick={() => buyUpgrade(runtime, slot.name)}
    >
      <span
        class={`${styles.sprite} ${affordable ? "" : styles.unaffordable}`}
        style={atlasStyle(upgradeIcon(slot.name))}
      />
      {level <= 6 && <span class={styles.levelTag}>{level}</span>}
      <span class={`${styles.priceTag} ${styles.stat} ${affordable ? "" : styles.unaffordable}`}>
        <RiCopperCoinLine aria-hidden size="1em" />
        <span>{Format.coin(slot.price.value)}</span>
      </span>
    </button>
  );
}
