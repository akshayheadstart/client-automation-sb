import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import FollowupSummaryDetailsCalendar from "../../components/ui/communication-performance/CommunicationSummary/FollowupSummary/FollowupSummaryDetailsCalendar";
import { formatDateAndTime } from "../../helperFunctions/formatDateAndTime";

describe("Testing FollowupSummaryDetailsCalendar component to be rendered", () => {
  const followupDetails = {
    overdue_followups: 10,
  };

  test("Checking the UI elements if all of them are showing as expected with the provided data", () => {
    // purpose of this test is checking of the component is rendering with the given data perfectly or not

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <FollowupSummaryDetailsCalendar
              followupDetails={followupDetails}
            ></FollowupSummaryDetailsCalendar>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const currentDate = formatDateAndTime(new Date()).formattedDate;
    expect(screen.queryAllByText("0/0")).toHaveLength(4);
    expect(screen.getByText(currentDate)).toBeInTheDocument();
    expect(screen.getByText("Total Over Due")).toBeInTheDocument();
    expect(screen.getByText("3rd Follow up")).toBeInTheDocument();
    expect(screen.getByText("2nd Follow up")).toBeInTheDocument();
    expect(screen.getByText("1st Follow up")).toBeInTheDocument();
    expect(screen.getByText("Completed / Total")).toBeInTheDocument();
    expect(screen.queryAllByText("10")).toHaveLength(2);
  });
});
