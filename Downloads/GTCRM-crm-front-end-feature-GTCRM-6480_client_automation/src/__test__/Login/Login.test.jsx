import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/LoginForm/Login";
import { TopProvider } from "../../store/contexts/TopContext";
import { store } from "../../Redux/store";
import { test } from "vitest";
test("Testing login component", () => {
  /*
        Purpose of this test :
            1. Rendering login component then click on the forgot password button
            2. Check it redirect to the forgot password component or not
            3. If redirect then test will pass if not then it will fail
     */

  render(
    <Provider store={store}>
      <TopProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </TopProvider>
    </Provider>
  );

  const login = screen.queryByRole("heading", { name: /login/i });
  const forgotPasswordButton = screen.queryByRole("button", {
    name: /forgot password/i,
  });
  expect(login).toBeInTheDocument();

  fireEvent.click(forgotPasswordButton);

  const forgotPasswordHeading = screen.queryByRole("heading", {
    name: /Forgot Password/i,
  });

  expect(forgotPasswordHeading).toBeInTheDocument();
});
