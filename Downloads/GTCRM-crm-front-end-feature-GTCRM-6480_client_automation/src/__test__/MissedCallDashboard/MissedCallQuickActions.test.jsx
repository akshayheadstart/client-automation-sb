import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";


import MissedCallQuickActions from "../../components/ui/communication-performance/MissedCalls/MissedCallQuickActions";

describe("Missed call quick action component test with different scenario", () => {
  test("Component to be rendered as expected with all the actions", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                
                  {" "}
                  <MissedCallQuickActions
                    selectedStudentMobile={["4141414141"]}
                  />{" "}
                
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("1 selected")).toBeInTheDocument();
    expect(screen.getByText("SMS")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Unselect")).toBeInTheDocument();
  });
});
