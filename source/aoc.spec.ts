import { expect } from "chai";

import { solve as day1 } from "./day1";
import { solve as day2 } from "./day2";
import { solve as day3 } from "./day3";
import { solve as day4 } from "./day4";
import { solve as day5 } from "./day5";
import { solve as day6 } from "./day6";
import { solve as day7 } from "./day7";
import { solve as day8 } from "./day8";
import { solve as day9 } from "./day9";
import { solve as day10 } from "./day10";
import { solve as day11 } from "./day11";
import { solve as day12 } from "./day12";
import { solve as day13 } from "./day13";
import { solve as day14 } from "./day14";

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

  // prettier-ignore
  it("day8", () => {
    const [part1, part2] = day8();
    expect(part1).to.eq(1224);
    expect(part2).to.eq(
      "████ ███  ████ █  █ ███  \n" +
      "█    █  █    █ █  █ █  █ \n" +
      "███  ███    █  █  █ █  █ \n" +
      "█    █  █  █   █  █ ███  \n" +
      "█    █  █ █    █  █ █ █  \n" +
      "████ ███  ████  ██  █  █ \n",
    );
  });

  it("day9", () => {
    const [part1, part2] = day9();
    expect(part1).to.eq(3780860499);
    expect(part2).to.eq(33343);
  });

  it("day10", () => {
    const [part1, part2] = day10();
    expect(part1).to.eq(256);
    expect(part2).to.eq(1707);
  });

  // prettier-ignore
  it("day11", () => {
    const [part1, part2] = day11();
    expect(part1).to.eq(2160);
    expect(part2).to.eq(
      ".█....███..████.████..██...██..████.████...\n" +
      ".█....█..█....█.█....█..█.█..█.█....█......\n" +
      ".█....█..█...█..███..█....█....███..███....\n" +
      ".█....███...█...█....█....█.██.█....█......\n" +
      ".█....█.█..█....█....█..█.█..█.█....█......\n" +
      ".████.█..█.████.████..██...███.█....████...\n",
    );
  });

  it("day12", () => {
    const [part1, part2] = day12();
    expect(part1).to.eq(10028);
    expect(part2).to.eq(314610635824376);
  });

  it("day13", () => {
    const [part1, part2] = day13();
    expect(part1).to.eq(270);
    expect(part2).to.eq(12535);
  });

  it("day14", () => {
    const [part1, part2] = day14();
    expect(part1).to.eq(598038);
    expect(part2).to.eq(2269325);
  });
});
