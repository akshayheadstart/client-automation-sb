import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { store } from "../../Redux/store";
import FollowUpListUpdate from "../../components/userProfile/FollowUpListUpdate";
import { vi } from "vitest";
const timeLineData = [
  {
    assigned_to: "vakado jaysko",
    created_by: "apollo college super",
    due: "05 Sep 2022 01:01 AM",
    followup: "New followup",
    followup_note: "asf",
    status: "Incomplete",
    timestamp: "05 Sep 2022 12:31 AM",
  },
];

test("Testing Followup list update component when data is found and no error", () => {
  /*
        Purpose of this test :
            1. Rendering component with expected data
            2. Expecting that component rendering successfully or not
            3. If not then it will fail
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <FollowUpListUpdate
            apiResponseStatusForFollowup={{
              setApiResponseStatusMessage: "",
              handleOpenStatus: vi.fn(),
              setAlertSeverity: "",
            }}
            openAlertMessage={false}
            setAlertType="success"
            openDialogs={true}
            timeLineData={timeLineData}
          />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  const addFollowup = screen.queryByText(/add followup/i);

  expect(addFollowup).toBeInTheDocument();
});

test("Testing Followup list update component when internal server error occurs", () => {
  /*
       Purpose of this test :
           1. Rendering component with internal server error
           2. Expecting internal server  to be shown in the UI
           3. If animation is now showing it will fail
    */

  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <FollowUpListUpdate
            apiResponseStatusForFollowup={{
              setApiResponseStatusMessage: "",
              handleOpenStatus: vi.fn(),
              setAlertSeverity: "",
            }}
            openAlertMessage={false}
            setAlertType="success"
            openDialogs={true}
            followUpData={timeLineData}
            timelineInternalServerError={true}
          />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  const internalErrorAnimation = screen.queryByTestId(
    /internal-server-error-animation/i
  );

  expect(internalErrorAnimation).toBeInTheDocument();
});
