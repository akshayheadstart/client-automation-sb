import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import StudentQualityIndex from "../../pages/Dashboard/StudentQualityIndex";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";

describe("Student Quality Index Component Test", () => {
  test("Show the content for Student Quality Index Component", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <StudentQualityIndex></StudentQualityIndex>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );

    expect(screen.getByText(/Student Quality Index/i)).toBeInTheDocument();
    expect(screen.getByText(/We recommend you to read the information tip for better understanding and visualizaiton/i)).toBeInTheDocument();
  });
});
