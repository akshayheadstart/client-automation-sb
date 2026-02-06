import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import FollowUpTaskTable from "../../components/ui/counsellor-dashboard/FollowUpTaskTable";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe("Testing followupTaskTable component", () => {
  const followupData = [
    {
      counselor_name: "viru chaudhary",
      course_name: "BSc in Imaging Technology",
      created_by: "viru chaudhary",
      days_gap: 0,
      followup_date: "20 Oct 2022 05:29 PM",
      index_number: 5,
      lead_activity: "12 Oct 2022 03:17 PM",
      overdue_days: 0,
      status: "Upcoming",
      student_name: "A L",
    },
  ];
  test("testing when followup task is incomplete", () => {
    // purpose of this test is checking of the component is rendering with the given data perfectly or not
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <FollowUpTaskTable
              followUpReportData={followupData}
            ></FollowUpTaskTable>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryAllByText("viru chaudhary")).toHaveLength(2);
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("A L")).toBeInTheDocument();
  });
});
