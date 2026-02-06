/* eslint-disable testing-library/prefer-screen-queries */
import { Provider } from "react-redux";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import ZoomPage from "../../components/shared/ZoomPage/ZoomPage";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe("Show Component Data", () => {
  test("displays  text", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <ZoomPage role="test role" />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const slider = screen.getByText("Profile");
    expect(slider).toBeInTheDocument();
    const slider1 = screen.getByText("Marking");
    expect(slider1).toBeInTheDocument();
  });
});
