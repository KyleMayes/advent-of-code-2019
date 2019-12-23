import * as _ from "lodash";

import { Grid2d } from "./common/grid2d";
import * as input from "./common/input";
import { Point2d } from "./common/geom2d";
import { computeIfAbsent } from "./common/map";

const lines = input.lines("day18.txt");

const grid = new Grid2d<string>();
const doors = new Map<string, Point2d>();
const keys = new Map<string, Point2d>();
let px = 0;
let py = 0;

for (let y = 0; y < lines.length; ++y) {
  for (let x = 0; x < lines[y].length; ++x) {
    const c = lines[y].charAt(x);
    grid.write(x, y, c);
    if (isDoor(c)) doors.set(c, [x, y]);
    if (isKey(c)) keys.set(c, [x, y]);
    if (lines[y].charAt(x) === "@") {
      px = x;
      py = y;
    }
  }
}

function isDoor(value: string): boolean {
  const code = value.charCodeAt(0);
  return code >= 65 && code <= 90;
}

function isKey(value: string): boolean {
  const code = value.charCodeAt(0);
  return code >= 97 && code <= 122;
}

interface Route {
  key: string;
  length: number;
  doors: string[];
}

function getKeyToKey(robot: Point2d): Map<string, Route[]> {
  const ktk = new Map<string, Route[]>();

  for (const [akey, apoint] of [["@", robot], ...keys.entries()] as [string, Point2d][]) {
    for (const [bkey, bpoint] of keys.entries()) {
      if (akey !== bkey) {
        const path = grid.path(
          apoint,
          bpoint,
          (_p, v) => v === "@" || v === "." || isKey(v) || isDoor(v),
        );

        if (path) {
          const doors = path.map(p => grid.read(p[0], p[1])!).filter(v => isDoor(v));
          computeIfAbsent(ktk, akey, () => []).push({ key: bkey, length: path.length, doors });
        }
      }
    }
  }

  return ktk;
}

function getShortestPath(robot: Point2d): number {
  const ktk = getKeyToKey(robot);

  const cache = new Map<string, number>();

  function getPath(key: string, collected: Set<string>): number {
    if (collected.size === keys.size) {
      return 0;
    }

    const cacheKey = `${key}:${JSON.stringify(Array.from(collected).sort())}`;
    const cacheValue = cache.get(cacheKey);
    if (cacheValue !== undefined) {
      return cacheValue;
    }

    const paths = ktk
      .get(key)!
      .filter(r => !collected.has(r.key) && !r.doors.some(d => !collected.has(d.toLowerCase())))
      .map(route => {
        const nextCollected = new Set(collected);
        nextCollected.add(route.key);
        return route.length + getPath(route.key, nextCollected);
      });

    const value = _.minBy(paths)!;
    cache.set(cacheKey, value);
    return value;
  }

  return getPath("@", new Set());
}

function getShortestPathMulti(tl: Point2d, tr: Point2d, bl: Point2d, br: Point2d): number {
  const ktk = {
    tl: getKeyToKey(tl),
    tr: getKeyToKey(tr),
    bl: getKeyToKey(bl),
    br: getKeyToKey(br),
  };

  const cache = new Map<string, number>();

  function getPath(
    key: { tl: string; tr: string; bl: string; br: string },
    collected: Set<string>,
  ): number {
    if (collected.size === keys.size) {
      return 0;
    }

    const cacheKey = `${JSON.stringify(key)}:${JSON.stringify(Array.from(collected).sort())}`;
    const cacheValue = cache.get(cacheKey);
    if (cacheValue !== undefined) {
      return cacheValue;
    }

    const paths: number[] = [];

    for (const robot of ["tl", "tr", "bl", "br"] as ("tl" | "tr" | "bl" | "br")[]) {
      const routes = ktk[robot].get(key[robot]) || [];
      for (const route of routes) {
        if (collected.has(route.key) || route.doors.some(d => !collected.has(d.toLowerCase()))) {
          continue;
        }

        const nextKey = { ...key, [robot]: route.key };
        const nextCollected = new Set(collected);
        nextCollected.add(route.key);
        paths.push(route.length + getPath(nextKey, nextCollected));
      }
    }

    const value = _.min(paths)!;
    cache.set(cacheKey, value);
    return value;
  }

  return getPath({ tl: "@", tr: "@", bl: "@", br: "@" }, new Set());
}

export function solve(): [number, number] {
  const part1 = getShortestPath([px, py]);

  grid.write(px, py, "#");
  grid.write(px + 1, py, "#");
  grid.write(px - 1, py, "#");
  grid.write(px, py + 1, "#");
  grid.write(px, py - 1, "#");
  const part2 = getShortestPathMulti(
    [px - 1, py - 1],
    [px + 1, py - 1],
    [px - 1, py + 1],
    [px + 1, py + 1],
  );

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
