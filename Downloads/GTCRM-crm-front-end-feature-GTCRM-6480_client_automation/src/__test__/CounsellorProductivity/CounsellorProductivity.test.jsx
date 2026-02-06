import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CounsellorProductivity from "../../components/ui/counsellor-dashboard/CounsellorProductivity";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";
import { vi } from "vitest";

describe("Counsellor Productivity Component Test", () => {
  test("Show the content for Counsellor Productivity Component", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <CounsellorProductivity
                isCounsellorProductivityReportLoading={false}
                loadInAdminDashboard={true}
                setIsCounsellorProductivityReportLoading={vi.fn()}
                isCounsellorPerformanceReportLoading={true}
              ></CounsellorProductivity>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );
    expect(
      screen.getByText(/Counsellor Productivity Report/i)
    ).toBeInTheDocument();
  });
});
