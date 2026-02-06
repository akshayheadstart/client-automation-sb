import { render, screen } from "@testing-library/react";
import AssignApplicationDialog from "../../components/ui/communication-performance/CommunicationSummary/AssignApplicationDialog";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

import CounsellorNameAndCheckoutTime from "../../components/ui/telephony-dashboard/CounsellorNameAndCheckoutTime";

describe("Render CounsellorNameAndCheckoutTime component to be rendered correctly with the provided data", () => {
  const details = {
    id: "62bf143c41782e1c3f308344",
    caller_name: "vakado jaysko",
    counsellor_status: "Inactive",
    check_in_duration_sec: 0,
    talk_time: 0,
    aht: 0,
    ideal_duration: 0,
    last_call_time: null,
    first_check_in: "01 Apr 2024 08:39:43 PM",
    last_check_out: new Date()?.toDateString(),
    check_out_duration_sec: null,
  };
  test("Testing if the details are showing in the UI when date range is empty", () => {
    /*
                Purpose of this test
                    1. Checking that the provided details only caller name is showing in the UI or not
                    2. If all the details are showing, the test will get passed otherwise failed.
            */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                  {" "}
                  <CounsellorNameAndCheckoutTime
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
  });
  test("Testing if the details are showing in the UI when date range is full", () => {
    /*
                Purpose of this test
                    1. Checking that the provided details like caller name and checkout duration.
                    2. If all the details are showing, the test will get passed otherwise failed.
            */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                  {" "}
                  <CounsellorNameAndCheckoutTime
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
    expect(screen.queryByText("00:00")).not.toBeInTheDocument();
  });
});
