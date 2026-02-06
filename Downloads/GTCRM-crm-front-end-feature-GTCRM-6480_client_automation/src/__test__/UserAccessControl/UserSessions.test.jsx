import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import UserSessions from "../../pages/UserAccessControl/UserSessions";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("UserSessions component test", () => {
  test("Testing UserSessions Component rendaring", () => {
    /*
            The purpose of this test :  
                1. Testing if UserSessions component render properlly, 
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <UserSessions />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const pageTitle = screen.getByText("Manage Sessions");
    const cardHeader = screen.queryByTestId("card-header");

    expect(pageTitle).toBeInTheDocument();
    expect(cardHeader).toBeInTheDocument();
  });
});
