import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import PublisherDashboard from "../../pages/Dashboard/PublisherDashboard";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("testing publisher dashboard", () => {
  /*
        Purpose of this test :
            1. Rendering and finding heading "Publisher dashboard"
            2. Checking for the first time when the data is loading, the loading animation is showing in the UI or not.
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <PublisherDashboard />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId("loading-animation")).toBeInTheDocument();
});
