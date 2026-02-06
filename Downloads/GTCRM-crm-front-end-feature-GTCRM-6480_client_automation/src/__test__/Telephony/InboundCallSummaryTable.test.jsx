import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import InboundCallSummaryTable from "../../components/ui/communication-performance/CommunicationSummary/InboundCallSummaryTable";
import MockTheme from "../MockTheme";

test("Testing the inbound call summary table to be rendered as expected with data", () => {
  const tableData = [
    {
      call_instance: new Date().toLocaleDateString(),
      incoming_number: "0123456789",
      call_to_name: "Viru",
      landing_number: "9632147850",
      call_status: "Answered",
    },
  ];
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MockTheme>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              {" "}
              <InboundCallSummaryTable tableData={tableData} />{" "}
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MockTheme>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Call Instance")).toBeInTheDocument();
  expect(screen.getByText("Incoming No")).toBeInTheDocument();
  expect(screen.getByText("Answered by")).toBeInTheDocument();
  expect(screen.getByText("Landing number")).toBeInTheDocument();
  expect(screen.getByText("Call status")).toBeInTheDocument();
  expect(screen.getByText("Duration")).toBeInTheDocument();
  expect(screen.getByText("Lead Name")).toBeInTheDocument();
  expect(screen.getByText("Assign Application")).toBeInTheDocument();
  expect(screen.getByText("Answered")).toBeInTheDocument();
  expect(screen.getByText("9632147850")).toBeInTheDocument();
  expect(screen.getByText("Viru")).toBeInTheDocument();
  expect(screen.getByText("0123456789")).toBeInTheDocument();
  expect(screen.getByText(new Date().toLocaleDateString())).toBeInTheDocument();
});
