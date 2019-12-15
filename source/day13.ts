import * as _ from "lodash";

import { Grid2d } from "./common/grid2d";
import * as input from "./common/input";
import { execute } from "./common/intcode";

const memory = input.csv("day13.txt").map(c => parseInt(c, 10));

function play(quarters?: number): Grid2d<number> {
  const grid = new Grid2d<number>();
  let x = 0;
  let y = 0;
  let state: "x" | "y" | "tile" = "x";
  let ballX = 0;
  let paddleX = 0;

  execute(
    memory,
    () => {
      if (ballX < paddleX) {
        return -1;
      } else if (ballX > paddleX) {
        return 1;
      } else {
        return 0;
      }
    },
    value => {
      switch (state) {
        case "x":
          x = value;
          state = "y";
          break;
        case "y":
          y = value;
          state = "tile";
          break;
        case "tile":
          if (x === -1 && y === 0) {
            grid.write(0, -1, value);
          } else {
            grid.write(x, y, value);
            if (value === 4) ballX = x;
            if (value === 3) paddleX = x;
          }
          state = "x";
          break;
      }
    },
    quarters ? [[0, quarters]] : undefined,
  );

  return grid;
}

export function solve(): [number, number] {
  const grid1 = play();
  const part1 = grid1.entries().filter(e => e[1] === 2).length;

  const grid2 = play(2);
  const part2 = grid2.read(0, -1)!;

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
