import * as _ from "lodash";

import { iota, permute } from "./common/array";
import * as input from "./common/input";
import { execute, start } from "./common/intcode";

const memory = input.csv("day7.txt").map(c => parseInt(c, 10));

export function solve(): [number, number] {
  let part1 = 0;
  for (const phases of permute(iota(0, 5))) {
    let output = 0;

    for (const phase of phases) {
      let inputs = [phase, output];
      execute(
        memory,
        () => inputs.shift()!,
        v => (output = v),
      );
    }

    part1 = Math.max(part1, output);
  }

  let part2 = 0;
  for (const phases of permute(iota(5, 10))) {
    let output = 0;

    const amplifiers = iota(0, phases.length).map(() => start(memory, v => (output = v)));
    phases.forEach((phase, index) => {
      amplifiers[index].next();
      amplifiers[index].next(phase);
    });

    let index = 0;
    while (true) {
      const done = amplifiers[index].next(output).done;
      if (done && index === amplifiers.length - 1) break;
      index = (index + 1) % amplifiers.length;
    }

    part2 = Math.max(part2, output);
  }

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
