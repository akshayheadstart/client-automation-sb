import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import FollowUpTask from "../../components/ui/counsellor-dashboard/FollowUpTask";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Follow Up Task Component Test", () => {
  test("Show the content for Follow Up Task Component", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <FollowUpTask></FollowUpTask>
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );

    const todaysFollowUpTab = screen.getByText("Today", { exact: true });
    const upcomingFollowUpTab = screen.getByText("Upcoming", { exact: true });
    const overDueFollowUpTab = screen.getByText("Overdue", { exact: true });
    const completedTab = screen.getByText("Completed", { exact: true });
    const allTab = screen.getByText("All", { exact: true });

    expect(todaysFollowUpTab).toBeInTheDocument();
    expect(upcomingFollowUpTab).toBeInTheDocument();
    expect(overDueFollowUpTab).toBeInTheDocument();
    expect(completedTab).toBeInTheDocument();
    expect(allTab).toBeInTheDocument();
  });
});
