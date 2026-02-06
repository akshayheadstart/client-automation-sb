/* eslint-disable testing-library/prefer-screen-queries */
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { store } from "../../Redux/store";
import PanelistDesignPage from "../../pages/Interview/PanelistDesignPage/PanelistDesignPage";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Show Component Data", () => {
  test("Testing  Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <PanelistDesignPage />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
  });
  test("displays 'Slot Planner' text", () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <PanelistDesignPage />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const textElement = getByText(
      `${
        new Date().getDate() < 10
          ? `0${new Date().getDate()}`
          : new Date().getDate()
      }`
    );
    expect(textElement).toBeInTheDocument();
  });
});
