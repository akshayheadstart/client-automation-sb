import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ApplicationTrendsGraph from "../../components/ui/application-manager/chartjs/ApplicationTrendsGraph";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

describe("ApplicationTrendsGraph component render", () => {
  test("Testing ApplicationTrendsGraph rendaring", () => {
    /*
                The purpose of this test :  
                    1. Testing if ApplicationTrendGraph component render properly.
            */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <ApplicationTrendsGraph collegeId={vi.fn()} />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const title = screen.queryByText("Application Trends");
    expect(title).toBeInTheDocument();
  });
});
