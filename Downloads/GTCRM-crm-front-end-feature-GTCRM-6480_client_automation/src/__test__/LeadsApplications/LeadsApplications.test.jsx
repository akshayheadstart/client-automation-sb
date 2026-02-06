import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import { store } from "../../Redux/store";
import EventTimeline from "../../components/EventTimeline/EventTimeline";
import LeadsApplications from "../../components/ui/admin-dashboard/LeadsApplications";
import { createMemoryHistory } from "history";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";
import paidVsLeadFormat from "../../constants/PaidVsLeadApplicationDataFormat";
describe("LeadsApplications", () => {
  test("Testing LeadsApplications component", () => {
    /*
            Purpose of this test:
                1. Rendering this component and expecting heading and total application, unpaid application, total applications to be in the document
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LeadsApplications chartsState={paidVsLeadFormat} />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const element = screen.getByText("Leads vs Paid Applications");
    expect(element).toBeInTheDocument();
  });

  test("Testing Event Timeline Component", () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router location={history.location}>
          <DashboardDataProvider>
            <EventTimeline handleClickOpen={vi.fn()} />
          </DashboardDataProvider>
        </Router>
      </Provider>
    );

    const eventHeadline = screen.getByTestId("eventHeadline");
    expect(eventHeadline).toBeInTheDocument();
    const viewAll = screen.queryByTestId("eventTimeline-viewAll-btn");
    expect(viewAll).toBeInTheDocument();
  });
});
