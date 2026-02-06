import { render, screen } from "@testing-library/react";
import ChoroplethMapLeads from "../../components/ui/admin-dashboard/ChoroplethMapLeads";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";

const leadData = [
  {
    total_applications: 57,
    total_leads: 2957,
    Other: {},
    map: [
      {
        application_count: 0,
        application_percentage: "30.00",
        lead_percentage: "2.60",
        state_code: "UP",
        state_name: "Uttar Pradesh",
        total_lead: 77,
      },
    ],
  },
];
test("Testing ChoroplethMapLeads component", () => {
  /*
        Purpose of this test :
            1. Rendering component with lead data
            2. Checking if tha lead data is showing in the UI or not
            3. If showing then test will pass of not then will fail
     */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ChoroplethMapLeads leadData={leadData} />
      </MemoryRouter>
    </Provider>
  );

  const providedStateName = screen.queryByText(/Uttar Pradesh/i);
  const leadPercentage = screen.queryByText("2.60%");

  expect(providedStateName).toBeVisible();
  expect(leadPercentage).toBeVisible();
});
