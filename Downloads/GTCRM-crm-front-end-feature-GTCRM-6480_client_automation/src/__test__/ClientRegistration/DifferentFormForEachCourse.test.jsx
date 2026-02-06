import { render, screen } from "@testing-library/react"
import DifferentFormForEachCourse from "../../components/shared/ClientRegistration/DifferentFormForEachCourse"

describe("Testing client creation dialog component to be rendered", () => {
    test("Testing when it is in edit", () => {
        render(<DifferentFormForEachCourse allCourses={[]} formFieldsStates={{}} />)

        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();

    })
    test("Testing when it is in preview mode", () => {
        render(<DifferentFormForEachCourse preview={true} allCourses={[]} formFieldsStates={{}} />)

        expect(screen.queryByText("Back")).not.toBeInTheDocument();
        expect(screen.queryByText("Next")).not.toBeInTheDocument();

    })
})