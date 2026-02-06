import { render, screen } from "@testing-library/react";
import { ScoreBoard } from "../../components/ui/admin-dashboard";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

const scoreBoardData = {
  payment_init_but_not_paid: 59,
  payment_not_initiated: 2836,
  form_initiated: 2948,
  total_lead: 2888,
  paid_application: 53,
  unpaid_application: 2895,
  un_verify_student: 2321,
  verify_student: 567,
};

test("ScoreBoard component testing", async () => {
  /*
        Purpose of this test :
            1. Rendering component with scoreboard data and expecting that data to be in the document
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <ScoreBoard scoreBoardData={scoreBoardData} />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const dateRange = screen.queryByText(/Date Range/i);
  const changeIndicator = screen.queryByText("Last 7 days");

  expect(dateRange).toBeInTheDocument();
  expect(changeIndicator).toBeInTheDocument();
});
