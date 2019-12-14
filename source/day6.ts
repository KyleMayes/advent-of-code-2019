import * as _ from "lodash";

import * as input from "./common/input";
import { Node, Tree } from "./common/tree";

export function solve(): [number, number] {
  const orbits = Tree.from(input.lines("day6.txt").map(l => l.split(")") as [string, string]));

  let part1 = 0;
  let san: Node<string> | undefined = undefined;
  let you: Node<string> | undefined = undefined;
  orbits.root.traverse(node => {
    part1 += node.depth;
    if (node.value === "SAN") san = node;
    if (node.value === "YOU") you = node;
  });

  const common = san!.common(you!);
  const part2 = san!.depth - common.depth + you!.depth - common.depth - 2;

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
