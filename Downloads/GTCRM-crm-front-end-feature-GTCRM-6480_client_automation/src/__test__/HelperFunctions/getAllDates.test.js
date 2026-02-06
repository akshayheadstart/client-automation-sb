import { getAllDates, getDateList, getFormattedDateList } from "../../utils/getAllDates"

describe("testing get all individual dates function", () => {
    test("Testing by giving the first date as starting date", () => {
        const dates = getAllDates(new Date(), new Date(new Date().setDate(new Date().getDate() + 1)));
        expect(dates.length).toBe(2)
    })

    test("testing getDateList function", () => {
        const date = getDateList([new Date()]);
        expect(date.length).toBe(1);
    })

    test("Testing getFormattedDateList function", () => {
        const dates = getFormattedDateList([new Date()]);
        expect(dates.length).toBe(1);
    })
})