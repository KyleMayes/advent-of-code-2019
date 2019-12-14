import * as _ from "lodash";

import { streak, iota } from "./common/array";

function check(password: string, length: (length: number) => boolean): boolean {
  const streaks = streak(password.split("")).map(s => s.join(""));

  for (let i = 1; i < streaks.length; ++i) {
    if (streaks[i].charCodeAt(0) < streaks[i - 1].charCodeAt(0)) {
      return false;
    }
  }

  return streaks.some(s => length(s.length));
}

export function solve(): [number, number] {
  const passwords = iota(235741, 706948).map(p => p.toString());
  const part1 = _.sumBy(passwords, p => Number(check(p, l => l > 1)));
  const part2 = _.sumBy(passwords, p => Number(check(p, l => l === 2)));
  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
