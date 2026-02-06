import { store } from "../../Redux/store";
import { Provider } from "react-redux";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import { render, screen } from "@testing-library/react";
import UserProfile from "../../pages/LeadManager/UserProfile";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

test("Rendering User Profile component", () => {
  /*
        Purpose of this test :
            1. Rendering UserProfile component when there has not any state
            2. Checking if the loading animation is showing or not
            3. If showing then it will pass of not then it will fail.
     */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <UserProfile />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Assigned to:")).toBeInTheDocument();
  expect(screen.getByText("Application No:")).toBeInTheDocument();
});
