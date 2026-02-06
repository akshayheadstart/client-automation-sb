import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import MODDesignPage from "../../pages/Interview/MODDesignPage/MODDesignPage";
import "./matchMedia.polyfill";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Show List of Data", () => {
  test("Testing show data MOD Page Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <MODDesignPage />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const textElement = screen.getByText("Create Slot");
    expect(textElement).toBeInTheDocument();
    const panelElement = screen.getByText("Create Panel");
    expect(panelElement).toBeInTheDocument();
  });
});
