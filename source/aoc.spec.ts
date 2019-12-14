import { expect } from "chai";

import { solve as day1 } from "./day1";

describe("aoc", () => {
  it("day1", () => {
    const [part1, part2] = day1();
    expect(part1).to.eq(3349352);
    expect(part2).to.eq(5021154);
  });
});
