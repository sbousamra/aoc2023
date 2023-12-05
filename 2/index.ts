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

const totals = parsed
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

const result = Utils.sum(totals);
console.log(`Result: ${result}`);
