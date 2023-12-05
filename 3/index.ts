import fs from "fs";
import * as Utils from "../utils";

const parsed = fs
  .readFileSync(`${__dirname}/data`)
  .toString()
  .split("\n")
  .map((item) => `.${item}.`)
  .join("");

const lineLength = 142;
const symbols = ["@", "#", "$", "%", "&", "*", "-", "=", "+", "/"];

const numbers = parsed
  .split("")
  .map((item) => (symbols.includes(item) ? "." : item))
  .join("")
  .split(".")
  .filter((item) => item !== "");

const containsSymbol = (str) => symbols.some((symbol) => str.includes(symbol));

let checkedInput = parsed;

const results = numbers.map((item) => {
  const startIndex = checkedInput.indexOf(item);
  const endIndex = startIndex + (item.length - 1);
  const lineNumber = Math.floor(startIndex / lineLength);
  const lineIndex = (startIndex + lineLength) % lineLength;

  // Mutate checkedInput to ensure indexOf will find the next instance of the number.
  // Replace the original number with "." to ensure we don't find the same number again
  // but keep the length the same as to preserve the geometry.
  checkedInput = checkedInput.replace(item, ".".repeat(item.length));

  const charToLeft = checkedInput[startIndex - 1];
  const charToRight = checkedInput[endIndex + 1];
  const charsAbove = checkedInput
    .split("")
    .slice(startIndex - lineLength - 1, endIndex - lineLength + 2)
    .join("");
  const charsBelow = checkedInput
    .split("")
    .slice(startIndex + lineLength - 1, endIndex + lineLength + 2)
    .join("");

  const isAdjacent =
    containsSymbol(charToLeft) ||
    containsSymbol(charToRight) ||
    containsSymbol(charsAbove) ||
    containsSymbol(charsBelow);

  return {
    value: item,
    startIndex,
    endIndex,
    lineNumber,
    lineIndex,
    charToLeft,
    charToRight,
    charsAbove,
    charsBelow,
    isAdjacent,
  };
});

const result = Utils.sum(
  results.filter((item) => item.isAdjacent).map((item) => parseInt(item.value))
);
console.log(`Result: ${result}`);
