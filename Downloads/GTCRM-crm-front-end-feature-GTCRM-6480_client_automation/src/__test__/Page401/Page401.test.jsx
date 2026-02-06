import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Page401 from "../../pages/ErrorPages/Page401";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";

test("Testing page401 component", () => {
  /*
        Purpose of this test :
            1. Render this component and expect authorization required heading and back to dashboard button
            2. If it found then test will pass
     */
  render(
    <MemoryRouter>
      <Provider store={store}>
        <Page401 />
      </Provider>
    </MemoryRouter>
  );
  const authorization = screen.queryByText(/401: Authorization required/i);
  const backToDashboardBtn = screen.queryByRole("button", {
    name: /Back to Login/i,
  });

  expect(authorization).toBeInTheDocument();
  expect(backToDashboardBtn).toBeInTheDocument();
});
