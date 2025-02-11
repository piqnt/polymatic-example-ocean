/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const Format = {
  coin: (num = 0) => {
    let str: string;
    if (num < 10000) {
      str = num + "";
    } else if (num < 1000000) {
      str = ((num / 100) | 0) / 10 + "k";
    } else {
      str = ((num / 10000) | 0) / 100 + "M";
    }
    return "$" + str;
  },

  k: (num = 0) => {
    num = (num / 10) | 0;
    let str: string;
    if (num < 10000) {
      str = num + "";
    } else if (num < 1000000) {
      str = ((num / 100) | 0) / 10 + "k";
    } else {
      str = ((num / 10000) | 0) / 100 + "M";
    }
    return ">" + str;
  },
};
