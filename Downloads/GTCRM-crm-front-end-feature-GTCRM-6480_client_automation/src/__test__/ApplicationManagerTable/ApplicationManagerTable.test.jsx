import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ApplicationManagerTable from "../../pages/ApplicationManager/ApplicationManagerTable";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

test("Testing ApplicationManagerTable component", () => {
  /*
        Purpose of this test :
            1. In the applicationManagerTable component there has a button name "actions",
            2. Once user clicks on that button then the "Download records" option will be visible
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <ApplicationManagerTable />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  const addFilter = screen.queryAllByText(/filter/i);
  const savedFilter = screen.queryByText(/select saved filter/i);

  expect(savedFilter).toBeInTheDocument();
  expect(addFilter?.length).toBe(2);
});
