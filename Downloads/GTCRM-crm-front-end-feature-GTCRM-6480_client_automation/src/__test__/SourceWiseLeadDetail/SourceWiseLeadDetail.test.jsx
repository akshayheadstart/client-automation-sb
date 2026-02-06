import { render, screen } from "@testing-library/react";
import SourceWiseLeadDetail from "../../components/ui/admin-dashboard/SourceWiseLeadDetail";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

const sourceWiseLeadDetailData = [
  {
    fresh_lead: 1245,
    total_count: 1245,
    utm_source: "growthtrack",
  },
];

test("testing SourceWiseLeadDetail component", () => {
  /*
        Purpose of this test :
            1. Rendering component by giving data as props
            2. Expecting that data to have in the document
    */
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <SourceWiseLeadDetail
            sourceWiseLeadDetailData={sourceWiseLeadDetailData}
          />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );

  const sourceWiseDetailHeading = screen.queryByText(
    /Source Wise Lead Detail/i
  );

  expect(sourceWiseDetailHeading).toBeInTheDocument();
});
