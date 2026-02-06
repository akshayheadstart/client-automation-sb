import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { store } from "../../Redux/store";
import EventMapping from "../../pages/CampaignManager/EventMapping";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
describe("Show Event Mapping of Data", () => {
  test("Testing Mapping Data Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <EventMapping />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Add Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Event Type/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Event Name/i)).toBeInTheDocument();
  });
});
