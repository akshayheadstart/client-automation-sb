import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import CallInfoTable from "../../../components/ui/communication-performance/CommunicationSummary/CallInfoTable/CallInfoTable";
import { Provider } from "react-redux";
import { store } from "../../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../../MockTheme";
import { DashboardDataProvider } from "../../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../../store/contexts/LayoutSetting";
import CallInfoTableFilters from "../../../components/ui/communication-performance/CommunicationSummary/CallInfoTable/CallInfoTableFilters";
import CallInfoTableDetails from "../../../components/ui/communication-performance/CommunicationSummary/CallInfoTable/CallInfoTableDetails";

describe("Testing CallInfoTable component and it's sub component", () => {
  test("Testing CallInfoTable to be rendered as expected", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <CallInfoTable />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("loading-container")).toBeInTheDocument();
    expect(screen.getByText(/call info/i)).toBeInTheDocument();
  });

  test("Testing CallInfoTableFilters component to be rendered as expected", () => {
    render(
      <Provider store={store}>
        <DashboardDataProvider>
          <CallInfoTableFilters />
        </DashboardDataProvider>
      </Provider>
    );

    expect(screen.getByText(/inbound call/i)).toBeInTheDocument();
    expect(screen.getByText(/outbound call/i)).toBeInTheDocument();
    expect(screen.getByText(/counsellor/i)).toBeInTheDocument();
    expect(screen.getByText(/date range/i)).toBeInTheDocument();
  });

  test("Testing CallInfoTableDetails component to be rendered with the given props", () => {
    const callInfoDetails = [
      {
        counsellor_name: "Rohan Agrawal",
        attempted_call: 1,
        connected_call: 1,
        duration: 300,
        average_duration: 300,
      },
    ];
    render(
      <CallInfoTableDetails callInfoDetails={callInfoDetails} tabValue={0} />
    );

    expect(screen.getByText("Counsellor Name")).toBeInTheDocument();
    expect(screen.getByText("Attempted")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Avg duration")).toBeInTheDocument();
    expect(screen.getByText("Rohan Agrawal")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBe(2);
    expect(screen.getAllByText("05:00").length).toBe(2);
  });
  test("Testing CallInfoTableDetails component to be rendered when the tab value is 1", () => {
    const callInfoDetails = [
      {
        counsellor_name: "viru chaudhary",
        received_call: 1,
        missed_call: 1,
        duration: 300,
        average_duration: 300,
      },
    ];
    render(
      <CallInfoTableDetails callInfoDetails={callInfoDetails} tabValue={1} />
    );

    expect(screen.getByText("Counsellor Name")).toBeInTheDocument();
    expect(screen.getByText("Missed")).toBeInTheDocument();
    expect(screen.getByText("Received")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Avg duration")).toBeInTheDocument();
    expect(screen.getByText("viru chaudhary")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBe(2);
    expect(screen.getAllByText("05:00").length).toBe(2);
  });
});
