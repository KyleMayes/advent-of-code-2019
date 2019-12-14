import * as _ from "lodash";

import * as input from "./common/input";
import { execute } from "./common/intcode";

const memory = input.csv("day2.txt").map(c => parseInt(c, 10));

// prettier-ignore
function check(a: number, b: number): number {
  return execute(memory, () => 0, () => {}, [[1, a], [2, b]]).read(0);
}

export function solve(): [number, number] {
  const part1 = check(12, 2);

  for (let a = 0; a < 100; ++a) {
    for (let b = 0; b < 100; ++b) {
      if (check(a, b) === 19690720) {
        return [part1, 100 * a + b];
      }
    }
  }

  throw new Error("no valid pair");
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
