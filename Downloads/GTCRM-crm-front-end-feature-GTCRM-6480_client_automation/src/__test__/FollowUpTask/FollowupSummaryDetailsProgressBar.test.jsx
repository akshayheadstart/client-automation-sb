import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { formatDateAndTime } from "../../helperFunctions/formatDateAndTime";
import FollowupSummaryDetailsProgressBar from "../../components/ui/communication-performance/CommunicationSummary/FollowupSummary/FollowupSummaryDetailsProgressBar";

describe("Testing FollowupSummaryDetailsProgressBar component to be rendered", () => {
  const followupDetails = {
    followup_under_head_counsellors: [
      { name: "Mohib", total_followup: 100, pending_followup: 50 },
    ],
  };

  test("Checking the UI elements if all of them are showing as expected with the provided data", () => {
    // purpose of this test is checking of the component is rendering with the given data perfectly or not

    const { debug } = render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <FollowupSummaryDetailsProgressBar
              followupDetails={followupDetails}
            ></FollowupSummaryDetailsProgressBar>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Mohib")).toBeInTheDocument();
    expect(screen.getByText("50/100")).toBeInTheDocument();
  });
  test("Checking the UI elements if the UI is showing empty if data is not provided", () => {
    // purpose of this test is checking of the component is rendering without any data or not

    const { debug } = render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <FollowupSummaryDetailsProgressBar
            //   followupDetails={}
            ></FollowupSummaryDetailsProgressBar>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText("Mohib")).not.toBeInTheDocument();
    expect(screen.queryByText("50/100")).not.toBeInTheDocument();
  });
});
