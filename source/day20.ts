/// <reference path="stub.d.ts" />

import * as nx from "jsnetworkx";
import * as _ from "lodash";

import * as input from "./common/input";
import { Point2d } from "./common/geom2d";
import { Grid2d } from "./common/grid2d";
import { computeIfAbsent } from "./common/map";

const lines = input.read("day20.txt", false).split("\n");

interface Portal {
  name: string;
  inner: Point2d;
  outer: Point2d;
}

export function solve(): [number, number] {
  const grid = new Grid2d<"floor" | "wall" | "portal">();

  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[y].length; ++x) {
      const c = lines[y].charAt(x);
      if (c === ".") {
        grid.write(x, y, "floor");
      } else if (c === "#") {
        grid.write(x, y, "wall");
      }
    }
  }

  const bbox = grid.bbox();
  const portals = new Map<string, Portal>();

  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[y].length; ++x) {
      const c = lines[y].charAt(x);
      if (!/\w/.test(c) || grid.read(x, y) === "portal") {
        continue;
      }

      const check = (dx: number, dy: number) => {
        const other = lines[y + dy]?.charAt(x + dx);
        if (/\w/.test(other) && grid.read(x - dx, y - dy) === "floor") {
          const name = dx < 0 || dy < 0 ? `${other}${c}` : `${c}${other}`;
          const inner = bbox.contains(x + 4 * dx, y + 4 * dy);
          return [name, inner] as [string, boolean];
        } else {
          return undefined;
        }
      };

      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const portal = check(dx, dy);
        if (portal) {
          grid.write(x, y, "portal");
          const value = computeIfAbsent(portals, portal[0], () => ({ name: portal[0] } as Portal));
          if (portal[1]) {
            value.inner = [x, y];
          } else {
            value.outer = [x, y];
          }
          break;
        }
      }
    }
  }

  const graph = new nx.DiGraph();

  for (const a of portals.values()) {
    for (const b of portals.values()) {
      if (a === b) {
        continue;
      }

      for (const [left, right, fromInner, toInner] of [
        [a.inner, b.inner, true, true],
        [a.outer, b.outer, false, false],
        [a.inner, b.outer, true, false],
        [a.outer, b.inner, false, true],
      ] as [Point2d, Point2d, boolean, boolean][]) {
        if (!left || !right) continue;
        const path = grid.path(left, right, (_p, v) => v === "floor" || v === "portal");
        if (path) {
          graph.addEdge(a.name, b.name, { weight: path.length - 1, fromInner, toInner });
        }
      }
    }
  }

  const part1 = nx.dijkstraPathLength(graph, { source: "AA", target: "ZZ" }) - 1;

  const recgraph = new nx.DiGraph();

  for (const edge of graph.edges(undefined, true)) {
    if (edge[0] === "AA" && edge[2].toInner) {
      recgraph.addEdge("AA", `${edge[1]}_I_0`, { weight: edge[2].weight });
    } else if (edge[1] === "ZZ" && edge[2].fromInner) {
      recgraph.addEdge(`${edge[0]}_I_0`, "ZZ", { weight: edge[2].weight });
    }
  }

  graph.removeNode("AA");
  graph.removeNode("ZZ");

  for (let level = 1; level < portals.size; ++level) {
    for (const node of graph.nodes()) {
      recgraph.addEdge(`${node}_I_${level - 1}`, `${node}_O_${level}`, { weight: 0 });
      recgraph.addEdge(`${node}_O_${level}`, `${node}_I_${level - 1}`, { weight: 0 });
    }

    for (const edge of graph.edges(undefined, true)) {
      recgraph.addEdge(
        `${edge[0]}_${edge[2].fromInner ? "I" : "O"}_${level}`,
        `${edge[1]}_${edge[2].toInner ? "I" : "O"}_${level}`,
        { weight: edge[2].weight },
      );
    }
  }

  const part2 = nx.dijkstraPathLength(recgraph, { source: "AA", target: "ZZ" }) - 1;

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
