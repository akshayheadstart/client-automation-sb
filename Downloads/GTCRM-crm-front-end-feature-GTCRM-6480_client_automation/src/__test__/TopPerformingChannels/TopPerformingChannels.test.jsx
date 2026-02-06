import { render, screen } from "@testing-library/react";
import { TopPerformingChannels } from "../../components/ui/admin-dashboard";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

const topPerformData = [
  {
    data: {
      direct_lead: 826,
      direct_lead_percentage: "28.60",
      direct_paid: 33,
      direct_paid_percentage: "100.00",
      source_wise_lead: [
        {
          paid_application_percentage: "0.00",
          paid_utm: 0,
          source_name: "facebook",
          total_percentage: "0.03",
          total_utm: 1,
        },
      ],
    },
  },
];

test("TopPerformingChannels component testing", () => {
  /*
        Purpose of this test :
            1. Rendering component by giving data as props
            2. Expecting that given data to have in the document
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <TopPerformingChannels topPerformData={topPerformData} />;
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const sectionTitle = screen.queryByText(/Channel wise Performance/i);
  const programName = screen.queryByText(/Program Name/i);

  expect(sectionTitle).toBeInTheDocument();
  expect(programName).toBeInTheDocument();
});
