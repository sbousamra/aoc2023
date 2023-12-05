import fs from "fs";
import * as Utils from "../utils";

const parsed = fs.readFileSync(`${__dirname}/data`).toString().split("\n");

const sumChars = (line: string): number => {
  let first: number | null = null;
  let last: number | null = null;

  line.split("").forEach((char) => {
    const asNumber = parseInt(char);

    if (Number.isNaN(asNumber)) {
      return;
    }

    if (first === null) {
      first = asNumber;
      last = asNumber;
    } else {
      last = asNumber;
    }
  });

  if (!first || !last) {
    throw new Error(`Bad input: ${line}`);
  }

  return parseInt(`${first}${last}`);
};

// Part 1
const totals1 = parsed.map(sumChars);
const result1 = Utils.sum(totals1);
console.log(`Part 1 result: ${result1}`);

// Part 2
const numberWordMap: Record<string, { replace: string; actual: number }> = {
  one: {
    replace: "o1e",
    actual: 1,
  },
  two: {
    replace: "t2o",
    actual: 2,
  },
  three: {
    replace: "t3e",
    actual: 3,
  },
  four: {
    replace: "f4r",
    actual: 4,
  },
  five: {
    replace: "f5e",
    actual: 5,
  },
  six: {
    replace: "s6x",
    actual: 6,
  },
  seven: {
    replace: "s7n",
    actual: 7,
  },
  eight: {
    replace: "e8t",
    actual: 8,
  },
  nine: {
    replace: "n9e",
    actual: 9,
  },
};
const totals2 = parsed.map((line) => {
  let replaced = line;

  Object.keys(numberWordMap).map((word) => {
    replaced = replaced.replace(
      new RegExp(word, "g"),
      numberWordMap[word].replace
    );
  });

  return sumChars(replaced);
});

const result2 = Utils.sum(totals2);
console.log(`Part 2 result: ${result2}`);
