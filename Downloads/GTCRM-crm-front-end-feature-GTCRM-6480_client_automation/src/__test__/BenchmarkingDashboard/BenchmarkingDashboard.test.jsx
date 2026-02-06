import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import BenchmarkingDashboard from "../../pages/Dashboard/BenchmarkingDashboard";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";

describe("Benchmarking Dashboard Test", () => {
  test("Show the content for Benchmarking Dashboard Component", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <BenchmarkingDashboard></BenchmarkingDashboard>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );

    expect(screen.getByText(/Benchmarking Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select an institute from filter and click apply to view benchmarking dashboard./i)).toBeInTheDocument();

  });
});
