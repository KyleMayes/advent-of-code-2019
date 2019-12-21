import * as _ from "lodash";

import * as input from "./common/input";

const numbers = input
  .read("day16.txt")
  .split("")
  .map(s => parseInt(s, 10));

const base = [0, 1, 0, -1];

function getPatternDigit(position: number, index: number): number {
  return base[Math.floor((index + 1) / position) % base.length];
}

export function solve(): [string, string] {
  let list1 = numbers.slice();
  for (let r = 0; r < 100; ++r) {
    for (let i = 0; i < list1.length; ++i) {
      let sum = 0;

      for (let j = 0; j < list1.length; ++j) {
        sum += list1[j] * getPatternDigit(i + 1, j);
      }

      list1[i] = Math.abs(sum) % 10;
    }
  }

  const part1 = list1.slice(0, 8).join("");

  let list2: number[] = [];
  for (let r = 0; r < 10000; ++r) {
    for (let i = 0; i < numbers.length; ++i) {
      list2.push(numbers[i]);
    }
  }

  for (let r = 0; r < 100; ++r) {
    let sum = list2.reduce((a, v) => a + v, 0);

    let list3: number[] = [];
    for (let i = 0; i < list2.length; ++i) {
      list3.push(((sum % 10) + 10) % 10);
      sum -= list2[i];
    }

    list2 = list3;
  }

  const offset = parseInt(numbers.slice(0, 7).join(""), 10);
  const part2 = list2.slice(offset, offset + 8).join("");

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
