import { render, screen } from "@testing-library/react";
import ChoropleteMapApplications from "../../components/ui/admin-dashboard/ChoropleteMapApplications";
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

test("Testing chropleteMap Application component", () => {
  /*
        Purpose of this test :
            1. Rendering by giving lead data to the component
            2. Checking if the given data is showing in the Ui or not
            3. If showing then it will pass if not then it will fail
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ChoropleteMapApplications leadData={leadData} />
      </MemoryRouter>
    </Provider>
  );

  const providedStateName = screen.queryByText(/Uttar Pradesh/i);
  const applicationPercentage = screen.queryByText("30.00%");

  expect(providedStateName).toBeVisible();
  expect(applicationPercentage).toBeVisible();
});
