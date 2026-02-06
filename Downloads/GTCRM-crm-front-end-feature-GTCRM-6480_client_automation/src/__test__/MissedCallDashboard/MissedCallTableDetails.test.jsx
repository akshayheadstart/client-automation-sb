import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import MissedCallTableDetails from "../../components/ui/communication-performance/MissedCalls/MissedCallTableDetails";

describe("Missed call table details component test with different scenario", () => {
  test("Testing the missed dashboard table to be rendered as expected with data", () => {
    const tableData = [
      {
        student_name: "New Lead",
        custom_application_id: "TAU/2024/BTechCE(E/0027",
        student_id: "65e6bd3f156042f445239d17",
        application_id: "65e6bd3f156042f445239d18",
        dialed_call_count: 7,
        missed_call_count: 1,
        assigned_counsellor: "Rohan Agrawal",
        missed_call_age: 23,
        student_mobile_number: 6200500903,
        landing_number: 1234567891,
      },
    ];
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                {" "}
                <MissedCallTableDetails missedCallList={tableData} />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("New Lead")).toBeInTheDocument();
    expect(screen.getByText("TAU/2024/BTechCE(E/0027")).toBeInTheDocument();
    expect(screen.getByText("Rohan Agrawal")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1234567891")).toBeInTheDocument();
    expect(screen.getByText("6200500903")).toBeInTheDocument();
    expect(screen.getByText("23 Days")).toBeInTheDocument();
  });
  test("Testing the missed dashboard table to be rendered as expected with no data", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                {" "}
                <MissedCallTableDetails missedCallList={[]} />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("not-found-animation")).toBeInTheDocument();
  });
  test("Testing the missed dashboard table to be rendered as expected when the data is loading", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                {" "}
                <MissedCallTableDetails loading={true} />{" "}
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("loading-animation")).toBeInTheDocument();
  });
});
