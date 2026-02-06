import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Page500 from "../../pages/ErrorPages/Page500"

test("Testing page404 component", () => {

    /*
        Purpose of this test :
            1. Render this component and expect error message and back to dashboard button
            2. If it found then test will pass
     */

    render(
        <MemoryRouter>
            <Page500 />
        </MemoryRouter>
    )

    const errorMessage = screen.queryByRole("heading", { name: /500: Internal Server Error/i });
    const backButton = screen.queryByRole("button", { name: /Back to Dashboard/i })

    expect(errorMessage).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
})