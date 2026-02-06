import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CounsellorManager from "../../pages/UserAccessControl/CounsellorManager";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("CounsellorManager component test", () => {
  test("Testing CounsellorManager Component rendering", () => {
    /*
            The purpose of this test :  
                1. Testing if CounsellorManager component render properly 
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <CounsellorManager />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const pageTitle = screen.getByText(/Counsellor Details/i);

    expect(pageTitle).toBeInTheDocument();
  });
});
