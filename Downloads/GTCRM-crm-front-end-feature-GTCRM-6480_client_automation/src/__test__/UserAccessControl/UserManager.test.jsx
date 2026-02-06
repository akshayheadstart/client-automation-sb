import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import UserManager from "../../pages/UserAccessControl/UserManager";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("UserManager component test", () => {
  test("Testing UserManager Component rendaring", () => {
    /* 
            The purpose of this test :  
                1. Testing if UserManager component render properlly, 
        */

    const { debug } = render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <UserManager />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const pageTitle = screen.getByText("User Manager");
    const tableTab = screen.getByText("Tables");
    const createUserButton = screen.queryByRole("button", {
      name: "Create User",
    });

    expect(pageTitle).toBeInTheDocument();
    expect(tableTab).toBeInTheDocument();
    expect(createUserButton).toBeInTheDocument();
  });
});
