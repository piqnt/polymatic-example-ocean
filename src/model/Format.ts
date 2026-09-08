/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** 1234 -> "1.2k", 1234567 -> "1.23M" */
const short = (num = 0) => {
  if (num < 10000) return num + "";
  if (num < 1000000) return ((num / 100) | 0) / 10 + "k";
  return ((num / 10000) | 0) / 100 + "M";
};

/*
 * Both of these drop the glyph the atlas font marked them with - the $ on a
 * coin amount and the > on a distance. That font is not something the DOM can
 * draw, so the hud puts an icon beside the number instead.
 */
export const Format = {
  coin: (num = 0) => short(num),

  distance: (num = 0) => short((num / 10) | 0),
};
