import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { store } from "../../Redux/store";
import CommunicationPerformanceDetails from "../../pages/ApplicationForms/communicationPerformance/CommunicationPerformance";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("Testing communication performance details component to be rendered", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <CommunicationPerformanceDetails />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText("Data Segment Communication Trend")
  ).toBeInTheDocument();
  expect(screen.getByText("Most used data segments")).toBeInTheDocument();
});
