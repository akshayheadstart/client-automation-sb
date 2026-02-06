import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { store } from "../../Redux/store";
import ActivePanelistManager from "../../pages/Interview/ActivePanelistManager/ActivePanelistManager";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Show List of Data", () => {
  test("Testing Active Panelist Manager Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <ActivePanelistManager />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getAllByText("Panelists").length).toBe(2);
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Slots")).toBeInTheDocument();
    expect(screen.getByText("Interview")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
