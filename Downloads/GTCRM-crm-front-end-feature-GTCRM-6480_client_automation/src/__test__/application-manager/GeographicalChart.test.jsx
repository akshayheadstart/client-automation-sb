import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import GeographicalChart from "../../components/ui/application-manager/chartjs/GeographicalChart";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

describe("GeographicalChart component render", () => {
  test("Testing GeographicalChart rendaring", () => {
    /*
        The purpose of this test :  
            1. In the ApplicationManagerTable component there is a button 'Geographical Segmentation', 
            2. if user click on the button GeographicalChart component will render".
    */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <GeographicalChart collegeId={vi.fn()} selectPickerValue="AN" />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const test1 = screen.getByText("State-wise Applications (India)");
    const test2 = screen.queryByText("City-wise Applications");
    expect(test1).toBeInTheDocument();
    expect(test2).toBeInTheDocument();
  });
});
