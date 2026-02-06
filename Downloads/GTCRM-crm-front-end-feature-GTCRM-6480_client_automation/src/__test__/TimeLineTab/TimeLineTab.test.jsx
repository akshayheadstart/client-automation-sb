import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import TimeLineTab from "../../components/userProfile/TimeLineTab";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

const timeLineData = [
  {
    message:
      "Abidur Rahman Chowdhury Application Name: BTech(Computer Science and Engineering)",
    timeline_type: "Application",
    timestamp: "30 Aug 2022 01:32 PM",
  },
];
describe("Testing TimelineTab component", () => {
  /*
        Purpose of this test :
            1. Rendering TimeLineTab component with data
            2. Checking the given data is showing in th UI or not
            3. If showing then test will pass if not showing then it will fail
     */

  test("Test when data is passed and no error", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <TimeLineTab timeLineData={timeLineData} />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const timelineName = screen.queryByText(/Abidur Rahman Chowdhury/i);
    const timelineDate = screen.queryByText(/30 Aug 2022/i);

    expect(timelineName).toBeInTheDocument();
    expect(timelineDate).toBeInTheDocument();
  });
  test("Test when internal server error occurs", () => {
    /*
            Purpose of this test :
                1. Rendering TimeLineTab component with empty data and internal server error
                2. Checking if the internal server error component is showing in the UI or not
                3. If showing then test will pass if not showing then it will fail
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <TimeLineTab timeLineData={[]} timelineInternalServerError={true} />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const internalServerErrorAnimation = screen.queryByTestId(
      /internal-server-error-animation/i
    );

    expect(internalServerErrorAnimation).toBeInTheDocument();
  });

  test("Testing when usr click on the action button", () => {
    /*
            Purpose of this test :
                1. Rendering TimeLineTab component and click on the action button
                2. Checking if the options like Application Stage, lead stage are showing in the UI or not
                3. If showing then test will pass if not showing then it will fail
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <TimeLineTab />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const actionButton = screen.getByText("Action");

    fireEvent.click(actionButton);

    const user = screen.queryByText(/user/i);
    const system = screen.queryByText(/System/i);
    const counselor = screen.queryByText(/Counselor/i);

    expect(user).toBeInTheDocument();
    expect(system).toBeInTheDocument();
    expect(counselor).toBeInTheDocument();
  });
});
