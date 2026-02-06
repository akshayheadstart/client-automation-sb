import { render, screen } from "@testing-library/react";
import AssignApplicationDialog from "../../components/ui/communication-performance/CommunicationSummary/AssignApplicationDialog";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";


test("Testing the Assign application dialog to be rendered as expected with data", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MockTheme>
          <DashboardDataProvider>
            <LayoutSettingProvider>
            
                {" "}
                <AssignApplicationDialog openDialog={true} />{" "}
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MockTheme>
      </MemoryRouter>
    </Provider>
  );
  const dialogTitle = screen.getByText("Assign Application");
  const dialogAction = screen.getByText("Assign");
  expect(dialogTitle).toBeInTheDocument();
  expect(dialogAction).toBeInTheDocument();
});
