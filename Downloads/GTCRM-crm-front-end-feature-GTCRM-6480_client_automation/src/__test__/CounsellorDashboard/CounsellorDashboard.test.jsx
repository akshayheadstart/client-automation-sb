import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CounsellorDashboard from "../../pages/Dashboard/CounsellorDashboard";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("Testing CounsellorDashboard component", () => {
  /**
        Purpose of this test :
            1. Render counsellor dashboard and expect the following headings
            2. If headings are found then test will pass of not then it will fail
     */

  const { debug } = render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <CounsellorDashboard />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const counsellorWiseLead = screen.queryByText("Lead Assigned");

  expect(counsellorWiseLead).toBeInTheDocument();
});
