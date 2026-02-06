import { render, screen } from "@testing-library/react";
import AssignApplicationDialog from "../../components/ui/communication-performance/CommunicationSummary/AssignApplicationDialog";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import CounsellorActivityActions from "../../components/ui/telephony-dashboard/CounsellorActivityActions";

test("Testing the counsellor call activity actions to be rendered with the details", () => {
  /*
            Purpose of this test
                1. Checking that all the quick actions are showing in the UI or not.
                2. If all the details are showing, the test will get passed otherwise failed.
        */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <MockTheme>
          <DashboardDataProvider>
            <LayoutSettingProvider>
                {" "}
                <CounsellorActivityActions
                  selectedCounsellorID={["id1"]}
                  counsellorCallActivityList={[]}
                />{" "}
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MockTheme>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("1 selected")).toBeInTheDocument();
  expect(screen.getByText("Check-Out")).toBeInTheDocument();
  expect(screen.getByText("Check-In")).toBeInTheDocument();
});
