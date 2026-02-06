import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ChangeApplicationStages from "../../components/userProfile/ChangeApplicationStages"
import { store } from "../../Redux/store"
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

const timeLineData = [
    {
        message: "Abidur Rahman Chowdhury Application Name: BTech(Computer Science and Engineering)",
        timeline_type: "Application",
        timestamp: "30 Aug 2022 01:32 PM"
    }
]

describe("Testing Change application stage component", () => {
    test("Testing ChangeApplicationStages component when data is found and no error", () => {

        /*
            Purpose of this test :
                1. Rendering component with expected data
                2. Expecting that data to be shown in the UI
                3. If data is now showing it will fail
         */
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <ChangeApplicationStages apiResponseStatusProps={""} openAlertMessage={false} setAlertType="success" openDialogs={true} timeLineData={timeLineData} />
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        )
        const timelineName = screen.queryByText(/Abidur Rahman Chowdhury/i)
        const timelineDate = screen.queryByText(/30 Aug 2022/i)
        const applicationStage = screen.queryByText(/Change Application Stage/i)

        expect(timelineName).toBeInTheDocument();
        expect(timelineDate).toBeInTheDocument();
        expect(applicationStage).toBeInTheDocument();

    })
    test("Testing ChangeApplicationStages component when internal server error occurs", () => {

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
                        <ChangeApplicationStages apiResponseStatusProps={""} openAlertMessage={false} setAlertType="success" openDialogs={true} timeLineData={timeLineData} counsellorListInternalServerError={true} />
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        )
        const internalErrorAnimation = screen.queryByTestId(/internal-server-error-animation/i)

        expect(internalErrorAnimation).toBeInTheDocument();

    })
})