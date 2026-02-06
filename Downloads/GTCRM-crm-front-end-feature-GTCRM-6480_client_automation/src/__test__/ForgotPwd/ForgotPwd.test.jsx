import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import ForgotPwd from "../../pages/LoginForm/ForgotPwd"
import { TopProvider } from "../../store/contexts/TopContext";

test("Forgot password component testing", () => {

    /*
        Purpose of this test :
            1. Rendering this component and checking the heading "reset password" and login button exist or not
            2. Then once user click on the login button then login component with having heading "login" should show in the UI
     */
    render(
        <MemoryRouter>
            <TopProvider>
                <ForgotPwd />
            </TopProvider>
        </MemoryRouter>
    )
    const resetPassHeading = screen.queryByRole("heading", { name: /Reset Password/i })

    const loginButton = screen.queryByRole("button", { name: "LOGIN?" })

    expect(resetPassHeading).toBeInTheDocument();

    fireEvent.click(loginButton);

    expect(screen.queryByText("heading", { name: /login/i }));
})