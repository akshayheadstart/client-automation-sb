import { describe, expect, test } from "vitest";
import { calculatePercentageOfValue } from "../../pages/StudentTotalQueries/helperFunction";

describe("Testing calculatePercentageOfValue to get expected results", () => {
  let value = 10;
  const allProgressValues = [10, 200, 100];
  test("Testing to get expected percentage when the first param is more than zero", () => {
    const percentage = calculatePercentageOfValue(value, allProgressValues);
    expect(percentage).toBe(5);
  });
  test("Testing to get expected percentage when the first param is zero", () => {
    value = 0;
    const percentage = calculatePercentageOfValue(value, allProgressValues);
    expect(percentage).toBe(0);
  });
});
