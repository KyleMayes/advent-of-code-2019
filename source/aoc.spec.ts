import { expect } from "chai";

import { solve as day1 } from "./day1";
import { solve as day2 } from "./day2";

describe("aoc", () => {
  it("day1", () => {
    const [part1, part2] = day1();
    expect(part1).to.eq(3349352);
    expect(part2).to.eq(5021154);
  });

  it("day2", () => {
    const [part1, part2] = day2();
    expect(part1).to.eq(3654868);
    expect(part2).to.eq(7014);
  });
});
