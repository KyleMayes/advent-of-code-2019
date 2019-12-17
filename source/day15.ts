import * as _ from "lodash";

import * as input from "./common/input";
import { execute } from "./common/intcode";
import { Point2d, eq2d, getManhattanDistance } from "./common/geom2d";
import { Grid2d } from "./common/grid2d";

type Direction = 1 | 2 | 3 | 4;
const north: Direction = 1;
const south: Direction = 2;
const west: Direction = 3;
const east: Direction = 4;

type Cell = "unexplored" | "floor" | "wall" | "sensor" | "oxygen";
const passable = new Set<Cell>(["floor", "sensor", "oxygen"]);

const memory = input.csv("day15.txt").map(c => parseInt(c, 10));

export function solve(): [number, number] {
  const grid = new Grid2d<Cell>();
  grid.write(0, 0, "floor");
  grid.write(1, 0, "unexplored");
  grid.write(-1, 0, "unexplored");
  grid.write(0, 1, "unexplored");
  grid.write(0, -1, "unexplored");

  let x = 0;
  let y = 0;
  let nextX = 0;
  let nextY = 0;
  let sensorX = 0;
  let sensorY = 0;
  let path: Point2d[] = [];

  const move = (direction: Direction) => {
    switch (direction) {
      case north:
        nextX = x;
        nextY = y - 1;
        break;
      case south:
        nextX = x;
        nextY = y + 1;
        break;
      case west:
        nextX = x - 1;
        nextY = y;
        break;
      case east:
        nextX = x + 1;
        nextY = y;
        break;
    }
  };

  execute(
    memory,
    () => {
      if (path.length === 0) {
        const unexplored = grid.entries().filter(e => e[1] === "unexplored");
        if (unexplored.length !== 0) {
          const target = _.minBy(unexplored, t => getManhattanDistance([x, y], t[0]))![0];
          path = grid.path([x, y], target, (p, v) => eq2d(p, target) || passable.has(v))!;
        } else {
          return "exit";
        }
      }

      const next = path.shift()!;
      if (next[0] > x) {
        move(east);
        return east;
      } else if (next[0] < x) {
        move(west);
        return west;
      } else if (next[1] < y) {
        move(north);
        return north;
      } else {
        move(south);
        return south;
      }
    },
    value => {
      switch (value) {
        case 0:
          grid.write(nextX, nextY, "wall");
          break;
        case 1:
          x = nextX;
          y = nextY;
          grid.write(x, y, "floor");
          break;
        case 2:
          x = sensorX = nextX;
          y = sensorY = nextY;
          grid.write(x, y, "sensor");
          break;
      }

      const check = (x: number, y: number) => {
        if (grid.read(x, y) === undefined) {
          grid.write(x, y, "unexplored");
        }
      };

      if (value !== 0) {
        check(x + 1, y);
        check(x - 1, y);
        check(x, y + 1);
        check(x, y - 1);
      }
    },
  );

  const part1 = grid.path([0, 0], [sensorX, sensorY], (_p, v) => passable.has(v))!.length;

  let part2 = 1;
  grid.write(sensorX, sensorY, "oxygen");
  for (; ; ++part2) {
    const oxygenated = grid
      .entries()
      .filter(e => e[1] === "oxygen")
      .map(e => e[0]);

    for (const [x, y] of oxygenated) {
      const check = (x: number, y: number) => {
        const contents = grid.read(x, y);
        if (contents === "floor") {
          grid.write(x, y, "oxygen");
        }
      };

      check(x + 1, y);
      check(x - 1, y);
      check(x, y + 1);
      check(x, y - 1);
    }

    if (grid.entries().filter(e => e[1] === "floor").length === 0) {
      break;
    }
  }

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
