import { render, screen } from "@testing-library/react";

import ManageCourses from "../../pages/CourseManagement/ManageCourses";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { MemoryRouter } from "react-router-dom";

describe("GIVEN ManageCourses", () => {
  test("should render component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <ManageCourses />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Manage Courses")).toBeInTheDocument();
  });
});
