import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import AssignMissedCallToCounsellorDialog from "../../components/ui/communication-performance/MissedCalls/AssignMissedCallToCounsellorDialog";

describe("Missed call quick action component test with different scenario", () => {
  test("Component to be rendered as expected when the loading is false", () => {
    /*
        Purpose of this test:
            1. Checking that the save button is showing in the UI while the loading is false
            2. If save button is showing the test case will get passed if not showing then it will get failed
    */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                  {" "}
                  <AssignMissedCallToCounsellorDialog
                    open={true}
                    loading={false}
                  />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Change Counselor")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
  test("Component to be rendered as expected when the loading is true", () => {
    /*
        Purpose of this test:
            1. Checking that the save button is showing in the UI while the loading is false
            2. If save button is not showing the test case will get passed if showing then it will get failed
    */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
              
                  {" "}
                  <AssignMissedCallToCounsellorDialog
                    open={true}
                    loading={true}
                  />{" "}
             
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Change Counselor")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });
});
