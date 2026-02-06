import { conventionCheck } from "../../utils/validation";


describe("Test email validation is working or not", () => {

    test('Proper email validation', () => {

        const emailEvent = { target: { value: "contactus@apollouniversity.edu.in" } }

        expect(conventionCheck(emailEvent, "emailRegex")).toBeTruthy()

    })
    test('Proper NAme validation', () => {

        const nameEvent = { target: { value: "Fahim Ashhab" } }

        expect(conventionCheck(nameEvent, "alphabetRegex")).toBeTruthy();

    })
})