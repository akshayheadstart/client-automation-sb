import { render, screen } from "@testing-library/react";
import ApplicationFunnel from "../../components/ui/admin-dashboard/ApplicationFunnel";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { MemoryRouter } from "react-router-dom";

test("Testing ApplicationFunnel component", () => {
  /*
        Purpose of this test:
            1. Rendering this component and expecting heading and total application, unpaid application, total applications to be in the document
    */
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <ApplicationFunnel />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  const applicationFunnelHeading = screen.queryByText("Application Funnel");
  const totalLeads = screen.queryByText(/leads/i);
  const paidApplication = screen.queryByText(/paid application/i);

  expect(applicationFunnelHeading).toBeInTheDocument();
  expect(totalLeads).toBeInTheDocument();
  expect(paidApplication).toBeInTheDocument();
});
