import { formatDateAndTime } from "../../helperFunctions/formatDateAndTime";

test("check the function format date and time to work as expected", () => {
  const dateAndTime = formatDateAndTime("2023-07-12 12:58:40");
  expect(dateAndTime.formattedDate).toBe("12 July 2023");
  expect(dateAndTime.formattedTime).toBe("12:58:40 PM");
});
