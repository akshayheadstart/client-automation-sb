import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import CallRecordingDialog from "../../components/ui/communication-performance/CommunicationSummary/CallRecordingDialog";

test("Testing the call recording dialog to be rendered as expected with data", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MockTheme>
          <DashboardDataProvider>
            <LayoutSettingProvider>
                {" "}
                <CallRecordingDialog
                  openDialog={true}
                  phoneNumber="0123456789"
                />{" "}
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MockTheme>
      </MemoryRouter>
    </Provider>
  );
  const title = screen.getByText("0123456789 Recording");
  expect(title).toBeInTheDocument();
});
