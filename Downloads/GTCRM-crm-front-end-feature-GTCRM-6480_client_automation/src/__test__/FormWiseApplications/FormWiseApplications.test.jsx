import { render, screen } from "@testing-library/react";
import { FormWiseApplications } from "../../components/ui/admin-dashboard";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

const applications = [
  {
    application_submitted: 1,
    course_name: "BSc in Physician Assistant",
    payment_initiated: 4,
    payment_not_initiated: 372,
    total_application: 378,
    total_paid_application: 2,
    total_unpaid_application: 376,
  },
];

test("FormStageWiseSegregation component test", () => {
  /*
        Purpose of this test :
            1. Rendering by giving applications in props
            2. Expecting provided data to be in the document
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <FormWiseApplications
            applications={applications}
            setStartDateRange={vi.fn()}
            setEndDateRange={vi.fn()}
          />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Program Wise Performance")).toBeInTheDocument();
  expect(screen.getByText("Select Counselor")).toBeInTheDocument();
  expect(screen.getByText("Source Name")).toBeInTheDocument();
});
test("FormStageWiseSegregation component test when data not found", () => {
  /*
        Purpose of this test :
            1. Rendering without giving applications in props
            2. Expecting not-found-animation to be in the document
    */
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <FormWiseApplications
            applications={[]}
            setStartDateRange={vi.fn()}
            setEndDateRange={vi.fn()}
          />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const notFoundAnimation = screen.queryByTestId("not-found-animation");
  expect(notFoundAnimation).toBeInTheDocument();
});
