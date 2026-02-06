import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AdminHeader } from "../components/ui/admin-dashboard";
import { store } from "../Redux/store";
import { DashboardDataProvider } from "../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../store/contexts/LayoutSetting";
import MockTheme from "./MockTheme";
import { vi } from "vitest";

describe("AdminHeader component test", () => {
  test("Edit layout button click and open a dawer", () => {
    /*
            The purpose of this test :  
                1. In the AdminHeader component there is a Edit layout button, 
                2. if user click on the button then a drawer will open having the text "Add Dashlets".
        */

    render(
      <Provider store={store}>
        <MockTheme>
          <MemoryRouter>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <AdminHeader setCollegeId={vi.fn()} />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MemoryRouter>
        </MockTheme>
      </Provider>
    );
    const editLayoutButton = screen.queryByTestId("edit-layout-button");
    fireEvent.click(editLayoutButton);
    const drawerTitle = screen.queryByText(/Add Dashlets/i);
    expect(drawerTitle).toBeInTheDocument();
  });
});
