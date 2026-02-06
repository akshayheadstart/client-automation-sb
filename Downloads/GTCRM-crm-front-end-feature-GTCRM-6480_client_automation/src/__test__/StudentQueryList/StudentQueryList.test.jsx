import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import StudentQueryList from "../../pages/Query_Manager/StudentQueryList";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";

describe("Student Query List Component Test", () => {
  test("Show the content for Student Query List Component", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <StudentQueryList></StudentQueryList>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );
    expect(screen.getByText(/Manage Student Queries/i)).toBeInTheDocument();

  });
});
