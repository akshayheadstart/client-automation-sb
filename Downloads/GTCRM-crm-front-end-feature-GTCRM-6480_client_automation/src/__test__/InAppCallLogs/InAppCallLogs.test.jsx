import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import InAppCallLogs from "../../pages/ApplicationForms/InAppCallLogs";

import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("Testing GenerateRules component", () => {
  /*
        Step and purpose of this test :
            1. Rendering this component and getting next button and create option
            2. First next button will be disabled but as soon as user click on "create" option then next button will be enabled
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <InAppCallLogs />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Inbound Call Activities")).toBeInTheDocument();
  expect(screen.getByText("Outbound Call Activities")).toBeInTheDocument();
});
