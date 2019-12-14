import { expect } from "chai";

import { solve as day1 } from "./day1";
import { solve as day2 } from "./day2";
import { solve as day3 } from "./day3";
import { solve as day4 } from "./day4";
import { solve as day5 } from "./day5";
import { solve as day6 } from "./day6";
import { solve as day7 } from "./day7";

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

  it("day3", () => {
    const [part1, part2] = day3();
    expect(part1).to.eq(557);
    expect(part2).to.eq(56410);
  });

  it("day4", () => {
    const [part1, part2] = day4();
    expect(part1).to.eq(1178);
    expect(part2).to.eq(763);
  });

  it("day5", () => {
    const [part1, part2] = day5();
    expect(part1).to.eq(13294380);
    expect(part2).to.eq(11460760);
  });

  it("day6", () => {
    const [part1, part2] = day6();
    expect(part1).to.eq(312697);
    expect(part2).to.eq(466);
  });

  it("day7", () => {
    const [part1, part2] = day7();
    expect(part1).to.eq(440880);
    expect(part2).to.eq(3745599);
  });
});
