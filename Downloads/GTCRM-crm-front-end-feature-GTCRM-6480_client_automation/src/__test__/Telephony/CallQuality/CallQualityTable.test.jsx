import { describe, expect } from "vitest";
import CallQualityTable from "../../../components/ui/communication-performance/CommunicationSummary/CallQualityTable";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../../MockTheme";
import { DashboardDataProvider } from "../../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../../store/contexts/LayoutSetting";
import CallQualityTableFilters from "../../../components/ui/communication-performance/CommunicationSummary/CallQualityTableFilters";
import CallQualityTableDetails from "../../../components/ui/communication-performance/CommunicationSummary/CallQualityTableDetails";

describe("Testing call quality table", () => {
  test("Testing the call quality table to be rendered as expected", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <CallQualityTable />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("loading-container")).toBeInTheDocument();
    expect(screen.getByText("Call Quality")).toBeInTheDocument();
  });
  test("Testing CallQualityTableFilter component to be rendered as expected", () => {
    render(
      <Provider store={store}>
        <CallQualityTableFilters />
      </Provider>
    );

    expect(screen.getByText(/date range/i)).toBeInTheDocument();
    expect(screen.getByText(/last 7 days/i)).toBeInTheDocument();
    expect(screen.getByText(/last 15 days/i)).toBeInTheDocument();
    expect(screen.getByText(/last 30 days/i)).toBeInTheDocument();
  });

  test("Testing CallQualityTableDetails component to be rendered with the given props", () => {
    const total = {
      total_call_count: 0,
      total_call_duration: 0,
      missed_call_count: 0,
    };
    const callQualityDetails = [
      {
        counsellor_name: "viru chaudhary",
        avg_call_per_day: 3.33,
        average_duration: 9.6,
        missed_call_count: 1,
        call_quality: 0.5,
      },
    ];
    render(
      <CallQualityTableDetails
        callQualityDetails={callQualityDetails}
        sumOfCallQualityDetails={total}
      />
    );

    expect(screen.getByText("Missed Calls")).toBeInTheDocument();
    expect(screen.getByText("Average Call Duration")).toBeInTheDocument();
    expect(screen.getByText("Average Call/day")).toBeInTheDocument();
    expect(screen.getByText("Call Qty %")).toBeInTheDocument();
    expect(screen.getByText("Counsellor Name")).toBeInTheDocument();
    expect(screen.getByText("viru chaudhary")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("00:00s")).toBeInTheDocument();
    expect(screen.getByText("3.33")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBe(2);
  });
});
