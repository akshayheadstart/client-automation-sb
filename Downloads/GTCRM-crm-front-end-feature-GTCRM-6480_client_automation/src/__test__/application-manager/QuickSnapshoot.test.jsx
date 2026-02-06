import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import QuickSnapshoot from "../../components/ui/application-manager/QuickSnapshoot";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe("QuickSnapshoot component render", () => {
  test("Testing QuickSnapshoot rendaring", () => {
    /*
                The purpose of this test :  
                    1. Testing if QuickSnapshoot component render properly.
            */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <QuickSnapshoot openQuickSnapShotDrawer={true} />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const heading = screen.queryByRole("heading", { name: /charts/i });
    const tab1 = screen.queryByText("Application Trends");
    const tab2 = screen.queryByText("Stage-wise Application");

    expect(heading).toBeInTheDocument();
    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();
  });
});
