import {
  generateHourListForAutomation,
  returnTimerOverlayWidth,
} from "../../helperFunctions/generateHoursList";

describe("Testing the helper function of generate Hour list component", () => {
  const parameters = {
    totalOverlayWidth: 200,
    leftSideGap: 10,
    rightSideGap: 10,
    index: 0,
    timerList: ["1", "2"],
  };

  test("Testing returnTimerOverlayWidth function when the timer length is tow", () => {
    /*
           Purpose of this test : 
               1. Checking my providing the params that the right and left both side gap is applicable when the timer list is tow and index is 0.
     */

    const result = returnTimerOverlayWidth(parameters);
    expect(result).toBe("180px");
  });
  test("Testing returnTimerOverlayWidth function when the timer length is more than tow", () => {
    /*
       `   Purpose of this test : 
                  1. Checking that the left side gap is getting applicable for the index 0 when the timer list of more than tow.
     */

    parameters.timerList = ["1", "2", "3"];
    const result = returnTimerOverlayWidth(parameters);
    expect(result).toBe("190px");
  });
  test("Testing returnTimerOverlayWidth function when the timer length is more than tow and index != 0", () => {
    /*
          Purpose of this test : 
                1. Checking that the right side gap is getting applicable for the index != 0
     */

    parameters.timerList = ["1", "2", "3"];
    parameters.index = 1;
    parameters.rightSideGap = 20;
    const result = returnTimerOverlayWidth(parameters);
    expect(result).toBe("180px");
  });

  test("Testing generateHourListForAutomation component to be returned expected timer", () => {
    /*        
        Purpose of this test : 
            1. Providing the start date and end date
            2. Expect the hours list which is the hour gap between the start and end date.
     */

    const startDate = new Date();
    const endDate = new Date().setHours(new Date().getHours() + 2);
    const result = generateHourListForAutomation(startDate, endDate);

    expect(result.length).toBe(3);
  });
});
