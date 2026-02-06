import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Page404 from "../../pages/ErrorPages/Page404"

test("Testing page404 component", () => {

    /*
        Purpose of this test :
            1. Render this component and expect error message and back to dashboard button
            2. If it found then test will pass
     */

    render(
        <MemoryRouter>
            <Page404 />
        </MemoryRouter>
    )
    const errorMessage = screen.queryByRole("heading", { name: /404: The page you are looking for isn’t here/i });
    const backButton = screen.queryByRole("button", { name: /Back to Dashboard/i })

    expect(errorMessage).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
})