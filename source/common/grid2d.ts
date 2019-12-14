import { computeIfAbsent } from "./map";

/** A 2D axis-aligned rectangle. */
export class Rectangle2d {
  public width: number;
  public height: number;

  constructor(public minX: number, public minY: number, public maxX: number, public maxY: number) {
    this.width = maxX - minX + 1;
    this.height = maxY - minY + 1;
  }

  /** Returns the area of this rectangle. */
  area(): number {
    return this.width * this.height;
  }

  /** Returns whether this rectangle contains the supplied point. */
  contains(x: number, y: number): boolean {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  /** Returns whether the supplied point is on the edge of this rectangle. */
  edge(x: number, y: number): boolean {
    return x === this.minX || x === this.maxX || y === this.minY || y === this.maxY;
  }

  /** Visits each point in this rectangle. */
  visit(visitor: (x: number, y: number) => void) {
    for (let y = this.minY; y <= this.maxY; ++y) {
      for (let x = this.minX; x <= this.maxX; ++x) {
        visitor(x, y);
      }
    }
  }
}

/** An infinite 2D grid. */
export class Grid2d<T> {
  private cells = new Map<number, Map<number, T>>();

  /** Reads a value previously written to this grid. */
  read(x: number, y: number): T | undefined {
    return this.cells.get(y)?.get(x);
  }

  /** Writes a value to this grid. */
  write(x: number, y: number, value: T): void {
    computeIfAbsent(this.cells, y, () => new Map<number, T>()).set(x, value);
  }

  /** Deletes a value previously written to this grid. */
  delete(x: number, y: number): boolean {
    const row = this.cells.get(y);
    if (row) {
      const deleted = row.delete(x);
      if (row.size === 0) this.cells.delete(y);
      return deleted;
    } else {
      return false;
    }
  }

  /** Returns the values previously written to this grid. */
  entries(): [number, number, T][] {
    const entries: [number, number, T][] = [];

    for (const [y, row] of this.cells.entries()) {
      for (const [x, value] of row.entries()) {
        entries.push([x, y, value]);
      }
    }

    return entries;
  }

  /** Returns the axis-aligned bounding box for the values written to this grid. */
  bbox(): Rectangle2d {
    if (this.cells.size === 0) {
      return new Rectangle2d(0, 0, 0, 0);
    }

    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    for (const [x, y] of this.entries()) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return new Rectangle2d(minX, minY, maxX, maxY);
  }

  /** Prints this grid to a string. */
  print(print: (value: T) => string, options?: { bbox?: Rectangle2d; fill?: string }): string {
    const bbox = options?.bbox ?? this.bbox();

    let array = new Array(bbox.area()).fill(options?.fill ?? " ");
    for (const [x, y, value] of this.entries()) {
      array[(y - bbox.minY) * bbox.width + (x - bbox.minX)] = print(value);
    }

    let contents = "";
    for (let y = 0; y < bbox.height; ++y) {
      const row = y * bbox.width;
      contents += array.slice(row, row + bbox.width).join("") + "\n";
    }

    return contents;
  }

  computeIfAbsent(x: number, y: number, compute: () => T): T {
    let value = this.read(x, y);
    if (value === undefined) {
      value = compute();
      this.write(x, y, value);
    }
    return value;
  }

  computeIfPresent(x: number, y: number, compute: (value: T) => T): T | null {
    let value = this.read(x, y);
    if (value !== undefined) {
      value = compute(value);
      this.write(x, y, value);
      return value;
    } else {
      return null;
    }
  }

  merge(x: number, y: number, value: T, merge: (a: T, b: T) => T): T {
    const old = this.read(x, y);
    value = value = old !== undefined ? merge(old, value) : value;
    this.write(x, y, value);
    return value;
  }
}
