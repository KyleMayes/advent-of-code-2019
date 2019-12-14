import * as _ from "lodash";

import * as input from "./common/input";
import { execute } from "./common/intcode";

const memory = input.csv("day5.txt").map(c => parseInt(c, 10));

// prettier-ignore
function check(input: number): number {
  let output = 0;
  execute(memory, () => input, v => (output = v));
  return output;
}

export function solve(): [number, number] {
  return [check(1), check(5)];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
