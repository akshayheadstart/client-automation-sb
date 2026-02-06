import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CreateUser from "../../pages/UserAccessControl/CreateUser";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("Testing createUser component", () => {
  /*
        Purpose of this test :
            1. Rendering createUser component and checking if the title and button name "create user" exists or not
            2. If exists then it will pass if not then ti will fail
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <CreateUser />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const userTypeField = screen.queryByLabelText(/Select User Type/i);
  const createUserHeading = screen.queryByRole("heading", {
    name: /Create User/i,
  });
  const createUserBtn = screen.queryByRole("button", { name: /Create User/i });

  expect(userTypeField).toBeInTheDocument();
  expect(createUserBtn).toBeInTheDocument();
  expect(createUserHeading).toBeInTheDocument();
});
