import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ClientRegistration from "../../pages/UserAccessControl/ClientRegistration";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("Testing ClientRegistration component", () => {
  /*
        Purpose of this test :
            1. Rendering clientRegistration component and checking the heading is exists or not
            2. If exists then it will pass if not then it will fail
    */
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <ClientRegistration />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const clientRegistration = screen.queryByTestId("client-registration");

  expect(clientRegistration).toBeInTheDocument();
});
