import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import OutboundCallSummaryTable from "../../components/ui/communication-performance/CommunicationSummary/OutboundCallSummaryTable";

test("Testing the inbound call summary table to be rendered as expected with data", () => {
  const tableData = [
    {
      call_instance: new Date().toLocaleDateString(),
      dialed_number: "0123456789",
      dialed_by: "Viru",
      landing_number: "9632147850",
      call_status: "Answered",
      _id: 1,
    },
  ];
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MockTheme>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              {" "}
              <OutboundCallSummaryTable tableData={tableData} />{" "}
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MockTheme>
      </MemoryRouter>
    </Provider>
  );

  // expect(screen.getByText("Call Instance")).toBeInTheDocument();
  // expect(screen.getByText("Dialed No")).toBeInTheDocument();
  // expect(screen.getByText("Call status")).toBeInTheDocument();
  // expect(screen.getByText("Duration")).toBeInTheDocument();
  // expect(screen.getByText("Lead Name")).toBeInTheDocument();
  // expect(screen.getByText("Assign Application")).toBeInTheDocument();
  // expect(screen.getByText("Answered")).toBeInTheDocument();
  // expect(screen.getByText("9632147850")).toBeInTheDocument();
  // expect(screen.getByText("Viru")).toBeInTheDocument();
  // expect(screen.getByText("0123456789")).toBeInTheDocument();
  // expect(screen.getByText(new Date().toLocaleDateString())).toBeInTheDocument();
});
