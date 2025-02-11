import image from "./main.png";

export default {
  image: { src: image, ratio: 8 },
  ppu: 16,
  textures: {
    "playbg": { x: 12.1, y: 4.1, width: 0.8, height: 0.8 },
    "homebg": { x: 13.1, y: 4.1, width: 0.8, height: 0.8 },

    "shadow": { x: 15.35, y: 4.25, width: 0.3, height: 0.1 },

    "option": { x: 14.25, y: 2.25, width: 1.5, height: 1.5 },
    "play": { x: 12.25, y: 2.25, width: 1.5, height: 1.5 },

    "logo": { x: 12, y: 0, width: 4, height: 1.8 },

    "coin_1": { x: 0, y: 1, width: 1, height: 1 },
    "coin_2": { x: 1, y: 1, width: 1, height: 1 },
    "coin_5": { x: 2, y: 1, width: 1, height: 1 },
    "coin_10": { x: 3, y: 1, width: 1, height: 1 },
    "coin_20": { x: 4, y: 1, width: 1, height: 1 },
    "coin_50": { x: 5, y: 1, width: 1, height: 1 },
    "coin_100": { x: 6, y: 1, width: 1, height: 1 },
    "coin_1000": { x: 7, y: 1, width: 1, height: 1 },
    "coin_10000": { x: 8, y: 1, width: 1, height: 1 },
    "coin_100000": { x: 9, y: 1, width: 1, height: 1 },
    "coin_1000000": { x: 10, y: 1, width: 1, height: 1 },

    "up_power": { x: 6, y: 0, width: 1, height: 1 },
    "up_oxygen": { x: 7, y: 0, width: 1, height: 1 },
    "up_speed": { x: 8, y: 0, width: 1, height: 1 },
    "up_pull": { x: 9, y: 0, width: 1, height: 1 },
    "up_push": { x: 10, y: 0, width: 1, height: 1 },
    "up_slow": { x: 11, y: 0, width: 1, height: 1 },

    "shark_0": { x: 0, y: 4, width: 1, height: 1 },

    "shark_1": { x: 1, y: 4, width: 1, height: 1 },
    "shark_2": { x: 2, y: 4, width: 1, height: 1 },
    "shark_3": { x: 3, y: 4, width: 1, height: 1 },
    "shark_4": { x: 4, y: 4, width: 1, height: 1 },
    "shark_5": { x: 5, y: 4, width: 1, height: 1 },

    "shark_6": { x: 6, y: 4, width: 1, height: 1 },

    "shark_alive": [
      "shark_1",
      "shark_2",
      "shark_3",
      "shark_4",
      "shark_5",
      "shark_5",
      "shark_4",
      "shark_3",
      "shark_2",
      "shark_1",
    ],

    "shark_weak": ["shark_6"],

    "shark_dead": ["shark_0"],

    "octopus_0": { x: 0, y: 5, width: 1, height: 1 },

    "octopus_1": { x: 1, y: 5, width: 1, height: 1 },
    "octopus_2": { x: 2, y: 5, width: 1, height: 1 },
    "octopus_3": { x: 3, y: 5, width: 1, height: 1 },
    "octopus_4": { x: 4, y: 5, width: 1, height: 1 },
    "octopus_5": { x: 5, y: 5, width: 1, height: 1 },

    "octopus_6": { x: 6, y: 5, width: 1, height: 1 },

    "octopus_alive": [
      "octopus_1",
      "octopus_2",
      "octopus_3",
      "octopus_4",
      "octopus_5",
      "octopus_5",
      "octopus_4",
      "octopus_3",
      "octopus_2",
      "octopus_1",
    ],

    "octopus_weak": ["octopus_6"],

    "octopus_dead": ["octopus_0"],

    "player_alive": [
      { x: 1, y: 3, width: 1, height: 1 },
      { x: 2, y: 3, width: 1, height: 1 },
      { x: 3, y: 3, width: 1, height: 1 },
      { x: 4, y: 3, width: 1, height: 1 },
      { x: 5, y: 3, width: 1, height: 1 },
      { x: 4, y: 3, width: 1, height: 1 },
      { x: 3, y: 3, width: 1, height: 1 },
      { x: 2, y: 3, width: 1, height: 1 },
    ],

    "player_dead": [
      { x: 2, y: 3, width: 1, height: 1 },
      { x: 6, y: 3, width: 1, height: 1 },
      { x: 0, y: 3, width: 1, height: 1 },
      { x: 2, y: 3, width: 1, height: 1 },
      { x: 6, y: 3, width: 1, height: 1 },
      { x: 0, y: 3, width: 1, height: 1 },
      { x: 2, y: 3, width: 1, height: 1 },
      { x: 6, y: 3, width: 1, height: 1 },
      { x: 0, y: 3, width: 1, height: 1 },
      { x: 0, y: 3, width: 1, height: 1 },
    ],

    "up": {
      "0": { x: 13.5, y: 1.75, width: 1, height: 0.3 },
      "1": { x: 13.25, y: 1.75, width: 1, height: 0.3 },
      "2": { x: 13.0, y: 1.75, width: 1, height: 0.3 },
      "3": { x: 12.75, y: 1.75, width: 1, height: 0.3 },
      "4": { x: 12.5, y: 1.75, width: 1.25, height: 0.3 },
      "5": { x: 12.25, y: 1.75, width: 1.5, height: 0.3 },
      "6": { x: 12.0, y: 1.75, width: 1.5, height: 0.3 },
    },

    "cursor": { x: 1, y: 0, width: 1, height: 1 },
    "oxygen": { x: 2, y: 0.05, width: 2, height: 0.4, left: 0.125, right: 0.125 },
    "powerup": { x: 2, y: 0.55, width: 2, height: 0.4, left: 0.125, right: 0.125 },
    "bubble": { x: 4, y: 0, width: 1, height: 1 },
    "power": { x: 5, y: 0, width: 1, height: 1 },

    "d": {
      "0": { x: 6.0 - 6, y: 2.05, width: 4.7 / 16, height: 0.4 },
      "1": { x: 6.5 - 6, y: 2.05, width: 3.1 / 16, height: 0.4 },
      "2": { x: 7.0 - 6, y: 2.05, width: 4.5 / 16, height: 0.4 },
      "3": { x: 7.5 - 6, y: 2.05, width: 4.3 / 16, height: 0.4 },
      "4": { x: 8.0 - 6, y: 2.05, width: 5.0 / 16, height: 0.4 },
      "5": { x: 8.5 - 6, y: 2.05, width: 4.4 / 16, height: 0.4 },
      "6": { x: 9.0 - 6, y: 2.05, width: 4.7 / 16, height: 0.4 },
      "7": { x: 9.5 - 6, y: 2.05, width: 4.5 / 16, height: 0.4 },
      "8": { x: 10.0 - 6, y: 2.05, width: 4.8 / 16, height: 0.4 },
      "9": { x: 10.5 - 6, y: 2.05, width: 4.8 / 16, height: 0.4 },
      "-": { x: 11.0 - 6, y: 2.05, width: 3.0 / 16, height: 0.4 },
      ".": { x: 11.5 - 6, y: 2.05, width: 2.0 / 16, height: 0.4 },
      "k": { x: 12.0 - 6, y: 2.05, width: 4.0 / 16, height: 0.4 },
      "M": { x: 12.5 - 6, y: 2.05, width: 7.0 / 16, height: 0.4 },
      "$": { x: 13.0 - 6, y: 2.05, width: 6.0 / 16, height: 0.4 },
      ">": { x: 13.5 - 6, y: 2.05, width: 6.0 / 16, height: 0.4 },
      "?": { x: 14.0 - 6, y: 2.05, width: 8.0 / 16, height: 0.4 },
      " ": { x: 14.5 - 6, y: 2.05, width: 5.0 / 16, height: 0.4 },
    },

    "di": {
      "0": { x: 6.0 - 6, y: 2.55, width: 4.7 / 16, height: 0.4 },
      "1": { x: 6.5 - 6, y: 2.55, width: 3.1 / 16, height: 0.4 },
      "2": { x: 7.0 - 6, y: 2.55, width: 4.5 / 16, height: 0.4 },
      "3": { x: 7.5 - 6, y: 2.55, width: 4.3 / 16, height: 0.4 },
      "4": { x: 8.0 - 6, y: 2.55, width: 5.0 / 16, height: 0.4 },
      "5": { x: 8.5 - 6, y: 2.55, width: 4.4 / 16, height: 0.4 },
      "6": { x: 9.0 - 6, y: 2.55, width: 4.7 / 16, height: 0.4 },
      "7": { x: 9.5 - 6, y: 2.55, width: 4.5 / 16, height: 0.4 },
      "8": { x: 10.0 - 6, y: 2.55, width: 4.8 / 16, height: 0.4 },
      "9": { x: 10.5 - 6, y: 2.55, width: 4.8 / 16, height: 0.4 },
      "-": { x: 11.0 - 6, y: 2.55, width: 3.0 / 16, height: 0.4 },
      ".": { x: 11.5 - 6, y: 2.55, width: 2.0 / 16, height: 0.4 },
      "k": { x: 12.0 - 6, y: 2.55, width: 4.0 / 16, height: 0.4 },
      "M": { x: 12.5 - 6, y: 2.55, width: 7.0 / 16, height: 0.4 },
      "$": { x: 13.0 - 6, y: 2.55, width: 6.0 / 16, height: 0.4 },
      ">": { x: 13.5 - 6, y: 2.55, width: 6.0 / 16, height: 0.4 },
      "?": { x: 14.0 - 6, y: 2.55, width: 8.0 / 16, height: 0.4 },
      " ": { x: 14.5 - 6, y: 2.55, width: 5.0 / 16, height: 0.4 },
    },

    "border": {
      x: 14.1,
      y: 4,
      width: 0.8,
      height: 1,
      top: 1 / 8,
      bottom: 1 / 8,
      left: 1 / 8,
      right: 1 / 8,
    },
  },
};
