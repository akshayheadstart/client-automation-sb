import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ApplicationHeader from "../../components/userProfile/ApplicationHeader";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Application Header Component Test", () => {
  test("Show the content for Application Header Component", () => {
    /*
        Purpose of this test :
           "Rendering Application Header Component and find the expecting elements"
    */
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <ApplicationHeader />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );

    expect(screen.getByText(/Application Stage:/i)).toBeInTheDocument();
    expect(screen.getByText(/Lead Stage:/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned to:/i)).toBeInTheDocument();
  });
});
