import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import VerifyPage from "../../pages/LoginForm/VerifyPage"

test("Testing VerifyPage component", () => {
    /*
        Purpose of this test :
            1. Rendering and checking if the continue button exists in the UI or not
     */
    render(
        <MemoryRouter>
            <VerifyPage />
        </MemoryRouter>
    );
    const continueButton = screen.queryByRole("button", { name: /continue/i });
    expect(continueButton).toBeInTheDocument()
})