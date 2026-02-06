import { render, screen } from "@testing-library/react";
import AssignApplicationDialog from "../../components/ui/communication-performance/CommunicationSummary/AssignApplicationDialog";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";


import ActivityListDetails from "../../components/ui/telephony-dashboard/ActivityListDetails";

describe("Render activity list details component to be rendered correctly with the provided data", () => {
  const details = {
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
  };
  test("Testing if the details are showing in the UI", () => {
    /*
                Purpose of this test
                    1. Checking that the provided details are showing in the UI or not.
                    2. If all the details are showing, the test will get passed otherwise failed.
            */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
              
                  {" "}
                  <ActivityListDetails
                    details={details}
                    callActivityDateRange={[]}
                  />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("vakado jaysko")).toBeInTheDocument();
    expect(screen.getByText("01 Apr 2024 08:39:43 PM")).toBeInTheDocument();
  });
  test("Testing if the details are showing in the UI based on Date condition", () => {
    /*
                Purpose of this test
                    1. Checking that the provided details are showing in the UI or not.
                    2. If all the details are showing, the test will get passed otherwise failed.
            */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                  {" "}
                  <ActivityListDetails
                    details={details}
                    callActivityDateRange={[new Date(), new Date()]}
                  />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("vakado jaysko")).toBeInTheDocument();
    expect(
      screen.queryByText("01 Apr 2024 08:39:43 PM")
    ).not.toBeInTheDocument();
  });
});
