import * as _ from "lodash";

import * as input from "./common/input";
import { Multiset } from "./common/multiset";

interface Resource {
  name: string;
  amount: number;
}

function parseResource(string: string): Resource {
  const [amount, name] = string.split(" ");
  return { name, amount: parseInt(amount, 10) };
}

interface Reaction {
  inputs: Resource[];
  output: Resource;
}

function parseReaction(string: string): Reaction {
  const [left, right] = string.split(" => ");
  const inputs = left.split(", ").map(s => parseResource(s));
  const output = parseResource(right);
  return { inputs, output };
}

const reactions = new Map(input.lines("day14.txt").map(s => {
  const reaction = parseReaction(s);
  return [reaction.output.name, reaction];
}));

function getOre(fuel: number): number {
  const inputs = new Multiset<string>();
  for (const input of reactions.get("FUEL")!.inputs) {
    inputs.add(input.name, input.amount * fuel);
  }

  const extra = new Multiset<string>();
  const getRequired = (name: string, amount: number) => {
    return Math.max(0, amount - extra.delete(name, amount));
  };

  while (true) {
    let done = true;

    for (const [name, amount] of inputs.entries().filter(e => e[0] !== "ORE")) {
      const required = getRequired(name, amount);
      inputs.delete(name, amount);
      if (required !== 0) {
        done = false;
        const reaction = reactions.get(name)!;
        const multiple = Math.ceil(required / reaction.output.amount);

        for (const input of reaction.inputs) {
          inputs.add(input.name, multiple * input.amount);
        }

        extra.add(name, (multiple * reaction.output.amount) - required);
      }
    }

    if (done) {
      break;
    }
  }

  return inputs.get("ORE")!;
}

export function solve(): [number, number] {
  const part1 = getOre(1);

  let part2 = Math.floor(1000000000000 / part1);
  for (const delta of [100000, 10000, 1000, 100, 10, 1]) {
    while (getOre(part2 + delta) < 1000000000000) {
      part2 += delta;
    }
  }

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
