import * as _ from "lodash";

import { Point2d, getVector, Vector2d } from "./common/geom2d";
import { Grid2d } from "./common/grid2d";
import * as input from "./common/input";
import { Multimap } from "./common/multimap";

export function solve(): [number, number] {
  const lines = input.lines("day10.txt");

  const grid = new Grid2d<boolean>();
  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[y].length; ++x) {
      if (lines[y].charAt(x) === "#") {
        grid.write(x, y, true);
      }
    }
  }

  let part1 = 0;
  let maxIndex = 0;

  const asteroids = grid.entries();
  for (let i = 0; i < asteroids.length; ++i) {
    const angles = new Set<number>();

    for (let j = 0; j < asteroids.length; ++j) {
      if (i !== j) {
        angles.add(getVector(asteroids[i][0], asteroids[j][0]).angle);
      }
    }

    if (angles.size > part1) {
      part1 = angles.size;
      maxIndex = i;
    }
  }

  const map = new Multimap<number, Vector2d>();
  for (let i = 0; i < asteroids.length; ++i) {
    if (i !== maxIndex) {
      const vector = getVector(asteroids[maxIndex][0], asteroids[i][0], { axis: "y-neg" });
      map.addEntry(vector.angle, vector);
    }
  }

  const vectors: [number, Vector2d[]][] = _.sortBy(
    map
      .entries()
      .map(([angle, asteroids]) => [angle, _.sortBy(Array.from(asteroids), v => v.length)]),
    ([angle]) => angle,
  );

  let destroyed = 0;
  for (let index = 0; ; index = index % vectors.length, destroyed += 1) {
    const kaboom = vectors[index][1].shift();

    if (destroyed === 199) {
      const [x, y] = kaboom!.b;
      return [part1, x * 100 + y];
    }

    if (vectors[index][1].length === 0) {
      vectors.splice(index, 1);
    } else {
      index += 1;
    }
  }
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
