import { parseTemplateText } from "../../components/Calendar/utils";

describe("Testing parseTemplateText function to perform operation as expected", () => {
  test("Testing my giving text to convert tag value", () => {
    const text = "First Name";
    const mergeData = [{ name: "First Name", value: "{First Name}" }];
    const returnedText = parseTemplateText(text, mergeData);
    expect(returnedText).toBe("{First Name}");
  });

  test("Testing whether the new line /n is getting removed or not", () => {
    const text = "First Name \n Hello";
    const mergeData = [{ name: "First Name", value: "{First Name}" }];
    const returnedText = parseTemplateText(text, mergeData);
    expect(returnedText.includes("\n")).toBeFalsy();
  });

  test("Testing by giving plain text to check if the {} is getting add or not. {} should not get add in the plain text", () => {
    const text = "Dear Student";
    const mergeData = [{ name: "First Name", value: "{First Name}" }];
    const returnedText = parseTemplateText(text, mergeData);
    expect(returnedText.includes("{")).toBeFalsy();
  });

  test("Testing my giving the third parameter as true which is isIncoming, to check if the tag is getting replaced with span tag or not.", () => {
    const text = "Dear {First Name}";
    const mergeData = [{ name: "First Name", value: "{First Name}" }];
    const returnedText = parseTemplateText(text, mergeData, true);
    expect(returnedText.includes("{")).toBeFalsy();
    expect(returnedText.includes("span")).toBeTruthy();
  });
});
