import { render, screen } from "@testing-library/react"
import ApplicationFillingStage from "../../components/ui/Report/ApplicationFillingStage"

test("Testing the Application filling stage component to be rendered as expected", () => {

    render(<ApplicationFillingStage filterName="Application filling stage" />)

    expect(screen.getByText("Application filling stage")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument()
})