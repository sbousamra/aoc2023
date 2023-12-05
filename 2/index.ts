import fs from "fs";
import * as Utils from "../utils";

const parsed = fs
  .readFileSync(`${__dirname}/data`)
  .toString()
  .split("\n")
  .map((line) => {
    const id = parseInt(line.split(":")[0].split(" ")[1]);
    const sets = line.split(": ")[1].split("; ");
    const countedSets = sets.map((set) => {
      const setColorCounts = set.split(", ").map((x) => {
        const [count, color] = x.split(" ");
        return { count: parseInt(count), color };
      });

      return {
        red: setColorCounts.find((c) => c.color === "red")?.count ?? 0,
        green: setColorCounts.find((c) => c.color === "green")?.count ?? 0,
        blue: setColorCounts.find((c) => c.color === "blue")?.count ?? 0,
      };
    });

    return { id, countedSets };
  });

const required = {
  red: 12,
  green: 13,
  blue: 14,
};

const totals1 = parsed
  .filter((line) => {
    return line.countedSets.every((set) => {
      return (
        set.red <= required.red &&
        set.green <= required.green &&
        set.blue <= required.blue
      );
    });
  })
  .map((line) => line.id);

const result1 = Utils.sum(totals1);
console.log(`Part 1 result: ${result1}`);

const totals2 = parsed.map((line) => {
  const minRed = Utils.maxBy(
    line.countedSets,
    (countedSet) => countedSet.red
  )?.red;
  const minGreen = Utils.maxBy(
    line.countedSets,
    (countedSet) => countedSet.green
  )?.green;
  const minBlue = Utils.maxBy(
    line.countedSets,
    (countedSet) => countedSet.blue
  )?.blue;

  if (!minRed || !minGreen || !minBlue) {
    throw new Error(`Bad input: ${line}`);
  }

  return minRed * minGreen * minBlue;
});

const result2 = Utils.sum(totals2);
console.log(`Part 2 result: ${result2}`);
