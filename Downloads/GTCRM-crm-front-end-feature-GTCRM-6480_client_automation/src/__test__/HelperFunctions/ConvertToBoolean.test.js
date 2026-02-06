import { checkEnvironment } from "../../utils/BooelanConvertion"

test("Testing the environment if it's in development or production", () => {
    expect(typeof checkEnvironment() === "boolean").toBeTruthy()
})
