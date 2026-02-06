import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Setting from "../../pages/Settings/Setting";
import UserDetails from "../../pages/Settings/UserDetails";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import { vi } from "vitest";
import MockTheme from "../MockTheme";

describe("Setting component test", () => {
  const userDetails = {
    name: "apollo college super",
    email: "apollo@example.com",
    mobile_number: 1234567890,
    associated_colleges: ["The Apollo University", "Fahim"],
    role_name: "college_super_admin",
    message: "Get current user details",
  };
  test("Setting page render properly", () => {
    /*
           The purpose of this test :
               1. in the Setting Page there is a Title "Settings", 
               2. Testing if Setting page render properly
        */
    render(
      <Provider store={store}>
        <MockTheme>
          <MemoryRouter>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <Setting />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MemoryRouter>
        </MockTheme>
      </Provider>
    );
    expect(screen.getByTestId("animation-container")).toBeInTheDocument();
  });

  test("Setting page password change button work", () => {
    /* 
           The purpose of this test :
              1. in the setting page top right corner, there is a button to change password
              2  when user will click on the password change button a Dialog will open having the text "Change Password"
        */

    render(
      <Provider store={store}>
        <MockTheme>
          <MemoryRouter>
            <DashboardDataProvider>
              <UserDetails
                userDetails={userDetails}
                handleOpenChangeUserDialog={vi.fn()}
              />
            </DashboardDataProvider>
          </MemoryRouter>
        </MockTheme>
      </Provider>
    );
    const passwordChange = screen.queryByRole("button", {
      name: "Change Password",
    });

    const name = screen.queryByText("Name");
    const email = screen.queryByText("Email");
    const mobileNumber = screen.queryByText("Mobile number");
    const role = screen.queryByText("Role");
    const assignedColleges = screen.queryByText("Assigned colleges");

    expect(passwordChange).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(mobileNumber).toBeInTheDocument();
    expect(role).toBeInTheDocument();
    expect(assignedColleges).toBeInTheDocument();
  });
});
