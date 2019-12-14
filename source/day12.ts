import * as _ from "lodash";

import * as input from "./common/input";
import * as math from "./common/math";
import { capture } from "./common/regex";

const moons = input.lines("day12.txt").map(line =>
  capture(/<x=(?<x>[-\d]+), y=(?<y>[-\d]+), z=(?<z>[-\d]+)>/, line, {
    x: s => parseInt(s),
    y: s => parseInt(s),
    z: s => parseInt(s),
  }),
);

interface Point {
  x: number;
  y: number;
  z: number;
}

class Simulation {
  positions: Point[];
  velocities: Point[];

  constructor(moons: Point[]) {
    this.positions = _.cloneDeep(moons);
    this.velocities = this.positions.map(() => ({ x: 0, y: 0, z: 0 }));
  }

  get energy(): number {
    let energy = 0;

    for (let i = 0; i < this.positions.length; ++i) {
      const potential =
        Math.abs(this.positions[i].x) +
        Math.abs(this.positions[i].y) +
        Math.abs(this.positions[i].z);
      const kinetic =
        Math.abs(this.velocities[i].x) +
        Math.abs(this.velocities[i].y) +
        Math.abs(this.velocities[i].z);
      energy += potential * kinetic;
    }

    return energy;
  }

  step() {
    for (let i = 0; i < this.positions.length; ++i) {
      for (let j = i + 1; j < this.positions.length; ++j) {
        this.gravitate(i, j, "x");
        this.gravitate(i, j, "y");
        this.gravitate(i, j, "z");
      }
    }

    for (let i = 0; i < this.positions.length; ++i) {
      this.positions[i].x += this.velocities[i].x;
      this.positions[i].y += this.velocities[i].y;
      this.positions[i].z += this.velocities[i].z;
    }
  }

  private gravitate(i: number, j: number, axis: "x" | "y" | "z") {
    if (this.positions[i][axis] > this.positions[j][axis]) {
      this.velocities[i][axis] -= 1;
      this.velocities[j][axis] += 1;
    } else if (this.positions[i][axis] < this.positions[j][axis]) {
      this.velocities[i][axis] += 1;
      this.velocities[j][axis] -= 1;
    }
  }
}

export function solve(): [number, number] {
  const sim1 = new Simulation(moons);
  for (let i = 0; i < 1000; ++i) sim1.step();
  const part1 = sim1.energy;

  const sim2 = new Simulation(moons);
  const periods = { x: -1, y: -1, z: -1 };
  for (let i = 0; ; ++i) {
    sim2.step();

    let done = true;
    for (const d of ["x", "y", "z"] as ("x" | "y" | "z")[]) {
      if (periods[d] === -1) {
        done = false;

        let initial = true;
        for (let m = 0; m < moons.length; ++m) {
          if (sim2.positions[m][d] !== moons[m][d] || sim2.velocities[m][d] !== 0) {
            initial = false;
            break;
          }
        }

        if (initial) {
          periods[d] = i + 1;
        }
      }
    }

    if (done) {
      break;
    }
  }

  return [part1, math.lcm([periods.x, periods.y, periods.z])];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
}
