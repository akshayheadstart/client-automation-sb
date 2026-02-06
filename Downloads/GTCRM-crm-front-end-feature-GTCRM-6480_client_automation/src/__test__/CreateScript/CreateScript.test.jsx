import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CreateScript from "../../pages/TemplateManager/CreateScript";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Create Script Component Test", () => {
  test("Show the content for Create Script Component", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <CreateScript></CreateScript>
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );

    expect(screen.getByText("Iframe + Script")).toBeInTheDocument();
    expect(screen.getByText("Upload JS File")).toBeInTheDocument();
    expect(screen.getByText("Enter Widget URL")).toBeInTheDocument();
  });
});
