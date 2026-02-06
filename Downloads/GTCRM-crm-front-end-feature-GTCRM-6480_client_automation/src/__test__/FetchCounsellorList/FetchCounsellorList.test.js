import { FetchCounsellorList } from "../../hooks/FetchCounsellorList"

test("Testing FetchCounsellorList function", () => {
    const returnedPromise = FetchCounsellorList();
    expect(typeof returnedPromise).toMatch("object");
})