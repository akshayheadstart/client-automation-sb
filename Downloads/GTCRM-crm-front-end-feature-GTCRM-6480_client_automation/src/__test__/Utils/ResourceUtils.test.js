import { validateInputText } from "../../utils/ResourceUtils";

describe("GIVEN ResourceUtils", () => {
  describe("validateInputText", () => {
    test("should return true for string with characters, numbers and space", () => {
      const result = validateInputText("Tag 01");

      expect(result).toBeTruthy();
    });

    test("should return false for text with special characters", () => {
      const result = validateInputText("Tag@123");

      expect(result).toBeFalsy();
    });
  });
});
