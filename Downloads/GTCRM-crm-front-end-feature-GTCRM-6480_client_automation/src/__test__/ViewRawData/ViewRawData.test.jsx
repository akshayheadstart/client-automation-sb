import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ViewRawData from "../../pages/ViewRawData/ViewRawData";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { store } from "../../Redux/store";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
test("Testing view raw data to be rendered successfully", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <ViewRawData />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText(/Showing/i)).toBeInTheDocument();
});
