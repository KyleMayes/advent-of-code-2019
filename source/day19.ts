import * as _ from "lodash";

import * as input from "./common/input";
import { execute } from "./common/intcode";
import { Grid2d } from "./common/grid2d";
import { getManhattanDistance, Point2d } from "./common/geom2d";

const memory = input.csv("day19.txt").map(c => parseInt(c, 10));

function testPoint(x: number, y: number): boolean {
  let output = 0;
  const inputs = [x, y];

  execute(
    memory,
    () => inputs.shift()!,
    v => (output = v),
  );

  return output === 1;
}

function testSquare(x: number, y: number, w: number, h: number): boolean {
  return testPoint(x, y) && testPoint(x + w, y) && testPoint(x, y + h) && testPoint(x + w, y + h);
}

function scan(grid: Grid2d<true>, maxX: number, maxY: number) {
  for (let y = 0; y < maxY; ++y) {
    for (let x = 0; x < maxX; ++x) {
      if (testPoint(x, y)) {
        grid.write(x, y, true);
      }
    }
  }
}

export function solve(): [number, number] {
  const grid = new Grid2d<true>();
  scan(grid, 50, 50);
  const part1 = grid.entries().length;

  let minX: number | null = null;
  let maxX = 0;
  for (let x = 0; x < 50; ++x) {
    if (grid.read(x, 49)) {
      if (minX === null) minX = x;
      maxX = x;
    }
  }

  const leftSlope = minX! / 49;
  const rightSlope = maxX / 49;

  let sx = 0;
  let sy = 0;
  outer: for (let y = 1082; ; y += 1) {
    const leftX = (leftSlope * y) | 0;
    const rightX = (rightSlope * y) | 0;
    for (let x = leftX; x < rightX; ++x) {
      if (testSquare(x, y, 99, 99)) {
        sx = x;
        sy = y;
        break outer;
      }
    }
  }

  const part2 = 10000 * sx + sy;

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
