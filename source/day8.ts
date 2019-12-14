import * as _ from "lodash";

import { Grid2d } from "./common/grid2d";
import * as input from "./common/input";

export function solve(): [number, string] {
  const image = input.read("day8.txt");

  const width = 25;
  const height = 6;
  const length = width * height;

  const layers: number[][] = [];
  for (let i = 0; i < image.length; i += length) {
    layers.push(
      image
        .substr(i, length)
        .split("")
        .map(c => parseInt(c, 10)),
    );
  }

  let min = Number.MAX_SAFE_INTEGER;
  let minIndex = 0;

  for (let i = 0; i < layers.length; ++i) {
    const zeros = layers[i].filter(n => n === 0).length;
    if (zeros < min) {
      min = zeros;
      minIndex = i;
    }
  }

  const ones = layers[minIndex].filter(n => n === 1).length;
  const twos = layers[minIndex].filter(n => n === 2).length;
  const part1 = ones * twos;

  const grid = new Grid2d<number>();
  for (const layer of layers.reverse()) {
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const pixel = layer[y * width + x];
        if (pixel !== 2) {
          grid.write(x, y, pixel);
        }
      }
    }
  }

  return [part1, grid.print(v => (v === 1 ? "█" : " "))];
}

if (require.main === module) {
  const [part1, part2] = solve();
  console.log(`Part 1: ${part1}`);
  console.log(`Part 2:\n${part2}`);
}
