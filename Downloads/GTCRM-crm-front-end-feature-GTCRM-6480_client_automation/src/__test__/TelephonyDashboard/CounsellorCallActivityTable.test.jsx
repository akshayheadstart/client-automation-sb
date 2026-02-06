import { render, screen } from "@testing-library/react";
import AssignApplicationDialog from "../../components/ui/communication-performance/CommunicationSummary/AssignApplicationDialog";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import CounsellorCallActivityTable from "../../components/ui/telephony-dashboard/CounsellorCallActivityTable";

describe("Testing counsellor call activity table component to be rendered as expected in different conditions", () => {
  const counsellorCallActivityList = [
    {
      id: "62bf143c41782e1c3f308344",
      caller_name: "vakado jaysko",
      counsellor_status: "Active",
      check_in_duration_sec: 0,
      talk_time: 0,
      aht: 0,
      ideal_duration: 0,
      last_call_time: null,
      first_check_in: "01 Apr 2024 08:39:43 PM",
      last_check_out: null,
      check_out_duration_sec: null,
    },
  ];
  test("Testing the counsellor call activity table to be rendered with the details", () => {
    /*
            Purpose of this test
                1. Checking that all the header of the table is showing in the UI or not.
                2. Checking the provided table row details are showing in the UI or not.
                3. If all the details are showing, the test will get passed otherwise failed.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                  {" "}
                  <CounsellorCallActivityTable
                    counsellorCallActivityList={counsellorCallActivityList}
                    loading={false}
                    callActivityDateRange={[]}
                  />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Last Check-out time")).toBeInTheDocument();
    expect(screen.getByText("First Check-In")).toBeInTheDocument();
    expect(screen.getByText("Last Call Time")).toBeInTheDocument();
    expect(screen.getByText("Inactive Hours")).toBeInTheDocument();
    expect(screen.getByText("Idle Duration")).toBeInTheDocument();
    expect(screen.getByText("AHT")).toBeInTheDocument();
    expect(screen.getByText("Talk Time")).toBeInTheDocument();
    expect(screen.getByText("Caller Name")).toBeInTheDocument();
    expect(screen.getByText("01 Apr 2024 08:39:43 PM")).toBeInTheDocument();
  });
  test("Testing the counsellor call activity table to be rendered with the details with condition", () => {
    /*
            Purpose of this test
                1. Checking that all the header of the table is showing conditionally in the UI or not.
                2. Checking the provided table row details are showing in the UI or not.
                3. If all the details are showing, the test will get passed otherwise failed.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                  {" "}
                  <CounsellorCallActivityTable
                    counsellorCallActivityList={counsellorCallActivityList}
                    loading={false}
                    callActivityDateRange={[new Date(), new Date()]}
                  />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText("Last Check-out time")).not.toBeInTheDocument();
    expect(screen.queryByText("First Check-In")).not.toBeInTheDocument();
    expect(screen.queryByText("Last Call Time")).not.toBeInTheDocument();
    expect(screen.getByText("Inactive Hours")).toBeInTheDocument();
    expect(screen.getByText("Idle Duration")).toBeInTheDocument();
    expect(screen.getByText("AHT")).toBeInTheDocument();
    expect(screen.getByText("Talk Time")).toBeInTheDocument();
    expect(screen.getByText("Caller Name")).toBeInTheDocument();
    expect(
      screen.queryByText("01 Apr 2024 08:39:43 PM")
    ).not.toBeInTheDocument();
  });
});
