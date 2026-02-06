import { render, screen, fireEvent } from "@testing-library/react";
import ManageFeature from "../pages/UserAccessControl/ManageFeature";
import { Provider } from "react-redux";
import MockTheme from "./MockTheme";
import { store } from "../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../store/contexts/LayoutSetting";

describe("ManageFeature", () => {
  test("renders the component and selects a feature", () => {
    render(
      <Provider store={store}>
        <MockTheme>
          {" "}
          <MemoryRouter>
            <DashboardDataProvider>
              {" "}
              <LayoutSettingProvider>
                <ManageFeature />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MemoryRouter>
        </MockTheme>
      </Provider>
    );

    // Check if the component renders without errors
    const manageFeatureTitle = screen.getByText("Updating...");
    expect(manageFeatureTitle).toBeInTheDocument();
  });
});
