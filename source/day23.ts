import * as _ from "lodash";

import * as input from "./common/input";
import { start } from "./common/intcode";
import { iota } from "./common/array";
import { computeIfAbsent } from "./common/map";

const memory = input.csv("day23.txt").map(c => parseInt(c, 10));

const states: ("address" | "x" | "y")[] = iota(0, 50).map(() => "address");
const outbound = new Map<number, { address: number; x: number }>();
const inbound = new Map<number, { x: number; y: number }[]>();
let nat: { x: number; y: number } | null = null;

let part1: number | null = null;

export function solve(): [number, number] {
  const routers = iota(0, 50).map(i =>
    start(memory, value => {
      switch (states[i]) {
        case "address":
          outbound.set(i, { address: value, x: 0 });
          states[i] = "x";
          break;
        case "x":
          outbound.get(i)!.x = value;
          states[i] = "y";
          break;
        case "y":
          const { address, x } = outbound.get(i)!;
          if (address == 255) {
            nat = { x, y: value };
            if (part1 === null) part1 = value;
          } else {
            computeIfAbsent(inbound, address, () => []).push({ x, y: value });
          }
          states[i] = "address";
          break;
      }
    }),
  );

  for (let i = 0; i < routers.length; ++i) {
    routers[i].next();
    routers[i].next(i);
  }

  let lastNatY = Number.MAX_SAFE_INTEGER;

  while (true) {
    if (!Array.from(inbound.values()).some(i => i.length !== 0) && nat !== null) {
      routers[0].next(nat.x);
      routers[0].next(nat.y);
      if (nat.y === lastNatY) {
        return [part1!, nat.y];
      } else {
        lastNatY = nat.y;
      }
    } else {
      for (let i = 0; i < routers.length; ++i) {
        const packets = inbound.get(i) || [];
        if (packets.length !== 0) {
          const { x, y } = packets.shift()!;
          routers[i].next(x);
          routers[i].next(y);
        } else {
          routers[i].next(-1);
        }
      }
    }
  }
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
