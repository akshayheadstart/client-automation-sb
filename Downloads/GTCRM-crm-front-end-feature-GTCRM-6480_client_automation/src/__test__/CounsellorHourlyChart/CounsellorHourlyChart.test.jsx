import { render, screen } from "@testing-library/react";
import CounsellorHourlyChart from "../../pages/Dashboard/CounsellorHourlyChart";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe("GIVEN CounsellorHourlyChart", () => {
  test("should render component", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <DashboardDataProvider>
            <CounsellorHourlyChart />
          </DashboardDataProvider>
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Leads")).toBeInTheDocument();
  });
});
