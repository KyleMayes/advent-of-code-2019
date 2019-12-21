import * as _ from "lodash";

import { Grid2d } from "./common/grid2d";
import * as input from "./common/input";
import { execute } from "./common/intcode";
import { iota } from "./common/array";

type Move = "L" | "R" | number;

const memory = input.csv("day17.txt").map(c => parseInt(c, 10));

function view(): string {
  let lines: string = "";

  execute(
    memory,
    () => 0,
    value => (lines += String.fromCharCode(value)),
  );

  return lines;
}

export function solve(): [number, number] {
  let robotX = 0;
  let robotY = 0;
  let direction: "up" | "down" | "left" | "right" = "up";
  const grid = new Grid2d<"visited" | "unvisited">();

  let y = -1;
  for (const line of view().split("\n")) {
    y += 1;
    for (let x = 0; x < line.length; ++x) {
      const c = line.charAt(x);
      if (c === "#") {
        grid.write(x, y, "unvisited");
      } else if (c === "^") {
        grid.write(x, y, "visited");
        robotX = x;
        robotY = y;
      }
    }
  }

  let part1 = 0;
  for (const [[x, y]] of grid.entries()) {
    if (
      grid.read(x + 1, y) !== undefined &&
      grid.read(x - 1, y) !== undefined &&
      grid.read(x, y + 1) !== undefined &&
      grid.read(x, y - 1) !== undefined
    ) {
      part1 += x * y;
    }
  }

  let moves: Move[] = [];
  const move = (dx: number, dy: number) => {
    if (grid.read(robotX + dx, robotY + dy) === "unvisited") {
      if (dx === 1) {
        moves.push(direction === "up" ? "R" : "L");
        direction = "right";
      } else if (dx === -1) {
        moves.push(direction === "down" ? "R" : "L");
        direction = "left";
      } else if (dy === 1) {
        moves.push(direction === "right" ? "R" : "L");
        direction = "down";
      } else if (dy === -1) {
        moves.push(direction === "left" ? "R" : "L");
        direction = "up";
      }

      let tdx = 0;
      let tdy = 0;
      while (grid.read(robotX + dx, robotY + dy) !== undefined) {
        robotX += dx;
        robotY += dy;
        grid.write(robotX, robotY, "visited");
        tdx += dx;
        tdy += dy;
      }

      moves.push(Math.max(Math.abs(tdx), Math.abs(tdy)));
      return true;
    } else {
      return false;
    }
  };

  while (move(1, 0) || move(-1, 0) || move(0, 1) || move(0, -1)) {}

  // Built functions by hand.
  const m: ("A" | "B" | "C")[] = [];
  const a: Move[] = ["R", 6, "L", 10, "R", 10, "R", 10];
  const b: Move[] = ["L", 10, "L", 12, "R", 10];
  const c: Move[] = ["R", 6, "L", 12, "L", 10];

  for (let i = 0; i < moves.length; ) {
    if (_.isEqual(a, moves.slice(i, i + a.length))) {
      i += a.length;
      m.push("A");
      continue;
    }

    if (_.isEqual(b, moves.slice(i, i + b.length))) {
      i += b.length;
      m.push("B");
      continue;
    }

    if (_.isEqual(c, moves.slice(i, i + c.length))) {
      i += c.length;
      m.push("C");
      continue;
    }

    console.log(moves.slice(i));
    process.exit(1);
  }

  let string = m.join(",") + "\n" + a.join(",") + "\n" + b.join(",") + "\n" + c.join(",") + "\nn\n";
  let ascii = iota(0, string.length).map(i => string.charCodeAt(i));

  let part2 = 0;
  execute(
    memory,
    () => ascii.shift()!,
    value => (part2 = value),
    [[0, 2]],
  );

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
