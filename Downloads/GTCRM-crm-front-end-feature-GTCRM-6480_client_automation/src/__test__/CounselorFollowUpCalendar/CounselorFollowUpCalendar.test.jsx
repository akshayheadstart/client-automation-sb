import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import CounselorFollowUpCalendar from "../../pages/Dashboard/CounselorFollowUpCalendar";

describe("GIVEN CounselorFollowUpCalendar", () => {
  test("Should render component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <CounselorFollowUpCalendar />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const leadAssignedElement = screen.getByText("Lead Assigned");

    expect(leadAssignedElement).toBeInTheDocument();
  });

  test("should render dot icon for highlighted days", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <CounselorFollowUpCalendar />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const lead = screen.getByText("Lead Assigned");
    const applications = screen.getByText("Paid Applications");
    const followup = screen.getByText("Follow-ups");
    const admission = screen.getByText("Admission Confirmed");

    expect(lead).toBeInTheDocument();
    expect(applications).toBeInTheDocument();
    expect(followup).toBeInTheDocument();
    expect(admission).toBeInTheDocument();
  });
});
