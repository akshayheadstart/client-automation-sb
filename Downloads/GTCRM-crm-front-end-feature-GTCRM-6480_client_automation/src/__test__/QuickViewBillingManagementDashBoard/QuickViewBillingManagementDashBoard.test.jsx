import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import QuickViewBillingManagementDashBoard from "../../pages/BillingManagementDashBoard/QuickViewBillingManagementDashBoard";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("QuickViewBillingManagementDashBoard", () => {
  const defaultProps = {
    headerDetailsData: {},
    isFetching: false,
    somethingWentWrongInBilling: false,
    billingInternalServerError: false,
    apiResponseChangeMessage: "",
  };

  test("renders loading animation when isFetching is true", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <QuickViewBillingManagementDashBoard
                {...defaultProps}
                isFetching={true}
              />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByTestId("loading-animation-container")
    ).toBeInTheDocument();
  });

  test("renders billing quick view data correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <QuickViewBillingManagementDashBoard
                {...defaultProps}
              />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByText("10").length).toBeGreaterThanOrEqual(2); // SMS and College Count
    expect(screen.getByText("100")).toBeInTheDocument(); // Price Features
  });
});
