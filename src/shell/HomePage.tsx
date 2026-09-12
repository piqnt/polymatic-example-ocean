/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type BookmarkSlot, type UpgradeSlot, Format } from "../model";
import { RiCopperCoinLine } from "react-icons/ri";
import { TbHelp, TbLock, TbMapPin, TbSailboat } from "react-icons/tb";

import { useRuntime } from "./context";
import { buyUpgrade, openHelp, pickBookmark } from "./actions";
import { atlasStyle, LOGO, upgradeIcon } from "./atlas";
import styles from "./Shell.module.css";

/** What each upgrade is called on its card, and what buying it does for you. */
const UPGRADE_INFO: Record<string, { title: string; about: string }> = {
  pull: { title: "Pull", about: "Draws nearby bubbles towards you" },
  speed: { title: "Speed", about: "Move around faster" },
  push: { title: "Push", about: "Pushes enemies away from you" },
  power: { title: "Power", about: "Power-ups last longer" },
  oxygen: { title: "Oxygen", about: "Your air runs out slower" },
  slow: { title: "Slow", about: "Slows the game down" },
};

/**
 * The menu: the logo with what you have earned, the bookmarks you can start a
 * run from plus the next one to unlock once a dive has given it a distance, and
 * six upgrades to spend on, each a card that says what it does. The artwork behind it is still drawn on the
 * stage (runtime/HomeBackdrop).
 */
export function HomePage() {
  const runtime = useRuntime();
  const { bookmarks, upgrades } = runtime.context.hud;

  return (
    <div class={styles.menu}>
      <div class={styles.menuInner}>
        <div class={`${styles.sprite} ${styles.logo}`} style={atlasStyle(LOGO, 1.4)}>
          <button type="button" class={styles.help} aria-label="How to play" onClick={() => openHelp(runtime)}>
            <TbHelp aria-hidden size="1em" />
          </button>
          <LogoStats />
        </div>

        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>Dive from</h2>
          <div class={styles.cards}>
            {bookmarks
              .filter(
                (slot) => slot.state.value === "owned" || (slot.state.value === "next" && slot.distance.value !== null),
              )
              .map((slot) => (
                <Bookmark key={slot.bookmark} slot={slot} />
              ))}
          </div>
        </section>

        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>Upgrades</h2>
          <div class={styles.cards}>
            {upgrades.map((slot) => (
              <Upgrade key={slot.name} slot={slot} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LogoStats() {
  const { userDist, userCoins } = useRuntime().context.hud;
  return (
    <span class={styles.logoStats}>
      <span class={styles.stat} aria-label="Coins">
        <RiCopperCoinLine aria-hidden size="1em" />
        <span>{Format.coin(userCoins.value)}</span>
      </span>
      <span class={styles.stat} aria-label="Distance">
        <TbMapPin aria-hidden size="1em" />
        <span>{Format.distance(userDist.value)}</span>
      </span>
    </span>
  );
}

/** The level as a row of capsules: the empty one you would be buying first, then one filled per level you own. */
function Level({ level }: { level: number }) {
  return (
    <span class={styles.level} aria-label={`Level ${level}`}>
      {Array.from({ length: level + 1 }, (_, i) => (
        <span key={i} class={`${styles.dot} ${i > 0 ? styles.dotFilled : ""}`} />
      ))}
    </span>
  );
}

function Price({ value, affordable }: { value: number; affordable: boolean }) {
  return (
    <span class={`${styles.stat} ${affordable ? "" : styles.unaffordable}`}>
      <RiCopperCoinLine aria-hidden size="1em" />
      <span>{Format.coin(value)}</span>
    </span>
  );
}

/**
 * One bookmark: the distance you dive from, and what a dive from there does.
 * Bookmark 0 is the surface; where a dive from bookmark N ends is saved as
 * bookmark N+1, which you unlock to dive from. Each card reads its own signals,
 * so buying an upgrade re-renders the cards whose price changed rather than the
 * whole menu.
 */
function Bookmark({ slot }: { slot: BookmarkSlot }) {
  const runtime = useRuntime();
  const state = slot.state.value;
  const distance = slot.distance.value;
  const price = slot.price.value;
  const affordable = slot.affordable.value;
  const n = slot.bookmark + 1;
  const last = n === runtime.context.hud.bookmarks.length - 1;

  let about, label;
  if (state === "owned" && n === 0) {
    about = "Dive from the surface. Where you end is saved as the next bookmark";
    label = "Dive from the surface";
  } else if (state === "owned" && distance !== null) {
    about = last ? "Dive from here" : "Dive from here. Where you end is saved as the next bookmark";
    label = `Dive from ${Format.distance(distance)}`;
  } else if (state === "owned") {
    about = "Saved when a dive from the previous bookmark ends";
    label = `Bookmark ${n}, not set yet`;
  } else {
    about = "Unlock to dive from here";
    label = `Unlock bookmark ${n}`;
  }

  return (
    <button type="button" class={styles.card} aria-label={label} onClick={() => pickBookmark(runtime, slot)}>
      <span class={styles.cardIcon}>
        {state === "owned" ? <TbSailboat aria-hidden size="1em" /> : <TbLock aria-hidden size="1em" />}
      </span>
      <span class={styles.cardBody}>
        <span class={`${styles.cardTitle} ${styles.cardDistance} ${styles.stat}`}>
          <TbMapPin aria-hidden size="1em" />
          <span>{distance !== null ? Format.distance(distance) : "\u2014"}</span>
        </span>
        <span class={styles.cardAbout}>{about}</span>
      </span>
      {price !== null && (
        <span class={styles.cardCorner}>
          <Price value={price} affordable={affordable} />
        </span>
      )}
    </button>
  );
}

function Upgrade({ slot }: { slot: UpgradeSlot }) {
  const runtime = useRuntime();
  const level = slot.level.value;
  const affordable = slot.affordable.value;
  const info = UPGRADE_INFO[slot.name] ?? { title: slot.name, about: "" };

  return (
    <button
      type="button"
      class={styles.card}
      aria-label={`Upgrade ${info.title} to level ${level + 1}`}
      onClick={() => buyUpgrade(runtime, slot.name)}
    >
      <span class={`${styles.sprite} ${styles.cardIcon}`} style={atlasStyle(upgradeIcon(slot.name), 0.72)} />
      <span class={styles.cardBody}>
        <span class={styles.cardTitle}>{info.title}</span>
        <span class={styles.cardAbout}>{info.about}</span>
      </span>
      <span class={styles.cardCorner}>
        <Level level={level} />
        <Price value={slot.price.value} affordable={affordable} />
      </span>
    </button>
  );
}
