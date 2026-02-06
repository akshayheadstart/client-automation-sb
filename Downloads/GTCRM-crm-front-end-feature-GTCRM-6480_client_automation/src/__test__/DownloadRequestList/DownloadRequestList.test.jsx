import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import DownloadRequestList from "../../pages/UserAccessControl/DownloadRequestList";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("Testing DownloadRequestList component", () => {
  /*
        Purpose of this test :
            1. Rendering component and finding heading and filter button
            2. Once user click on the filter button then filter option like filter by user name will show
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <DownloadRequestList />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const filterIcon = screen.queryByTestId("FilterAltIcon");

  fireEvent.click(filterIcon);

  const userTypeFiled = screen.queryByText(/user type/i);

  expect(userTypeFiled).toBeVisible();
});
