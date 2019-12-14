import * as _ from "lodash";

import { Grid2d } from "./common/grid2d";
import * as input from "./common/input";
import { execute } from "./common/intcode";

const memory = input.csv("day11.txt").map(c => parseInt(c, 10));

function paint(grid: Grid2d<"black" | "white">) {
  let x = 0;
  let y = 0;
  let direction = 0;
  let state: "paint" | "move" = "paint";
  execute(
    memory,
    () => (grid.read(x, y) === "white" ? 1 : 0),
    value => {
      switch (state) {
        case "paint":
          grid.write(x, y, value === 1 ? "white" : "black");
          state = "move";
          break;
        case "move":
          if (value === 1) {
            direction = (direction + 90) % 360;
          } else {
            direction = (360 + direction - 90) % 360;
          }

          switch (direction) {
            case 0:
              y -= 1;
              break;
            case 90:
              x += 1;
              break;
            case 180:
              y += 1;
              break;
            case 270:
              x -= 1;
              break;
          }

          state = "paint";
          break;
      }
    },
  );
}

export function solve(): [number, string] {
  const grid1 = new Grid2d<"black" | "white">();
  paint(grid1);
  const part1 = grid1.entries().length;

  const grid2 = new Grid2d<"black" | "white">();
  grid2.write(0, 0, "white");
  paint(grid2);
  const part2 = grid2.print(v => (v === "white" ? "█" : "."), { fill: "." });

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2:\n${part2}`);
}
