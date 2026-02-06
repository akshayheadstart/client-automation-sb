import { render, screen } from "@testing-library/react";

import Resources from "../../pages/ResourceManagement/Resources";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { MemoryRouter } from "react-router-dom";

describe("GIVEN Resources", () => {
  test("should render component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <Resources />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("Updates")).toBeInTheDocument();
    expect(screen.getByText("Script")).toBeInTheDocument();
    expect(screen.getByText("FAQ Categories")).toBeInTheDocument();
  });
});
