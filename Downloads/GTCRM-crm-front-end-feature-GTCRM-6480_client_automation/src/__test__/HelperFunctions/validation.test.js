import { tagsValidation, removeCharacters } from "../../utils/validation"

describe("Test Sharable Tag component", () => {

    test('Only number and character are accepting or not', () => {
        const event = { type: 'k' }
        // const event = { type: '1' }
        // const event = { type: ' ' }
        // const event = { type: '-' }
        expect(tagsValidation(event)).toBeTruthy();

    })
})

describe('Test removeCharacters', () => {
    test('should return only numeric value from string', () => {
        expect(removeCharacters('3 Years')).toEqual('3');
        expect(removeCharacters('Rs. 1000.0 /-')).toEqual('1000.0');
        expect(removeCharacters('Rs.Rs.Rs.1000.0 /-/-/-')).toEqual('1000.0');
    })
});
