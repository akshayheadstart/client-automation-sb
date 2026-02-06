import { regexToValidateDate } from "../../components/shared/forms/Validation"

test("Testing regexToValidateDate function by giving correct format of the date", () => {
    const result = regexToValidateDate().test("09/12/2022 09:12 pm");
    expect(result).toBeTruthy();
})

test("Testing regexToValidateDate by giving wrong date format", () => {
    const result = regexToValidateDate().test("09/12/2022 09:12 ");
    expect(result).toBeFalsy()
})