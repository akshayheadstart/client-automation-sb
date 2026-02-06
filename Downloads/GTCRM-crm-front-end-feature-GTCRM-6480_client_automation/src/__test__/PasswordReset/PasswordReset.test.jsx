import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import PasswordReset from "../../pages/LoginForm/PasswordReset"

test("Testing PasswordReset component", () => {

    /*
        Purpose of this test :
            1. Rendering this component and check if reset password heading and reset password message exist in the UI
    */
    render(
        <MemoryRouter>
            <PasswordReset />
        </MemoryRouter>
    );
    const resetPassword = screen.queryByRole("heading", { name: /Password Reset/i });
    const passwordResetMsg = screen.queryByText(/Reset your account password using your code/i);

    expect(resetPassword).toBeInTheDocument();
    expect(passwordResetMsg).toBeInTheDocument();
})