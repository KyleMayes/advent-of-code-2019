import * as _ from "lodash";

import * as input from "./common/input";

export function solve(): [number, number] {
  const weights = input.lines("day1.txt").map(l => parseInt(l, 10));

  const part1 = _.sumBy(weights, w => (w / 3 - 2) | 0);

  const part2 = _.sumBy(weights, weight => {
    let previous = weight;
    let current = weight + ((weight / 3 - 2) | 0);
    for (;;) {
      const difference = current - previous;
      const additional = (difference / 3 - 2) | 0;
      if (additional > 0) {
        previous = current;
        current = current + additional;
      } else {
        return current - weight;
      }
    }
  });

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
