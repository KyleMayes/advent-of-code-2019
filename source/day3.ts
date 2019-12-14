import * as _ from "lodash";

import { Grid2d } from "./common/grid2d";
import * as input from "./common/input";

const delta: { [key: string]: [number, number] } = {
  L: [-1, 0],
  R: [1, 0],
  U: [0, 1],
  D: [0, -1],
};

export function solve(): [number, number] {
  const wires = input.linesCsv("day3.txt");

  const grid = new Grid2d<number>();

  let steps = 0;
  let x = 0;
  let y = 0;
  for (const command of wires[0]) {
    for (let i = 0; i < parseInt(command.substr(1)); ++i) {
      steps += 1;
      const [dx, dy] = delta[command.charAt(0)];
      x += dx;
      y += dy;
      grid.write(x, y, steps);
    }
  }

  let minDistance = Number.MAX_SAFE_INTEGER;
  let minSteps = Number.MAX_SAFE_INTEGER;

  steps = 0;
  x = 0;
  y = 0;
  for (const command of wires[1]) {
    for (let i = 0; i < parseInt(command.substr(1)); ++i) {
      steps += 1;
      const [dx, dy] = delta[command.charAt(0)];
      x += dx;
      y += dy;
      const previous = grid.read(x, y);
      if (previous) {
        minDistance = Math.min(minDistance, Math.abs(x) + Math.abs(y));
        minSteps = Math.min(minSteps, previous + steps);
      }
    }
  }

  return [minDistance, minSteps];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
