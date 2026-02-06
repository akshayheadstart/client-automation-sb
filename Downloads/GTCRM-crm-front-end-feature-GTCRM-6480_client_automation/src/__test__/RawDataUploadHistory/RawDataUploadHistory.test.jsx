import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import RawDataUploadHistory from "../../pages/Query_Manager/RawDataUploadHistory";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("RawDataUploadHistory Component Test", () => {
  test("Show the content for RawDataUploadHistory Component", () => {
    /*
           Purpose of this test :
               1. Rendering user RawDataUploadHistory component and expecting the heading "Raw Data upload History", reset and filter button to be in the document
       */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <RawDataUploadHistory></RawDataUploadHistory>
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const resetButton = screen.queryByTestId("reset-button");

    expect(resetButton).toBeInTheDocument();
  });
});
