import * as _ from "lodash";

import * as input from "./common/input";
import { execute } from "./common/intcode";

const memory = input.csv("day21.txt").map(c => parseInt(c, 10));

function testProgram(program: string[]): number | string {
  let instruction: string[] = [];

  function getCharacter(): number {
    if (instruction.length === 0) {
      instruction = program.shift()!.split("");
      instruction.push("\n");
    }

    return instruction.shift()!.charCodeAt(0);
  }

  let damage: number = 0;
  let history: string = "";

  execute(
    memory,
    () => getCharacter(),
    v => (v >= 256 ? (damage = v) : (history += String.fromCodePoint(v))),
  );

  return damage !== 0 ? damage : history;
}

export function solve(): [number, number] {
  const part1 = testProgram([
    "OR A J",
    "AND B J",
    "AND C J",
    "NOT J J",
    "AND D J",
    "WALK",
  ]) as number;

  const part2 = testProgram([
    "OR A J",
    "AND B J",
    "AND C J",
    "NOT J J",
    "AND D J",
    "OR E T",
    "OR H T",
    "AND T J",
    "RUN",
  ]) as number;

  return [part1, part2];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
