import { fetchCourseList } from "../../hooks/FetchCourseList"

test("Testing fetch course list whether it return object", () => {
    const returnedObject = fetchCourseList();
    expect(typeof returnedObject).toBe("object");
})