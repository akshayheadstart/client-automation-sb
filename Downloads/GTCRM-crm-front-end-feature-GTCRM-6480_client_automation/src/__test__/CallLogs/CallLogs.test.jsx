import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import CallLogs from "../../components/userProfile/CallLogs"
import { store } from "../../Redux/store"
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext"

const callLogs = {
    call_timelines: [
        {
            message: "Mark Andry",
            timestamp: "01 Sep 2022 08:17 PM"
        }
    ],
    call_duration: 0,
    inbound_call: 0,
    outbound_call: 0

}
describe("Testing callLogs component", () => {

    test("Testing when there has not any error and data is passed successfully", () => {

        /*
            Purpose of this test :
                1. Rendering by giving data
                2. Checking if the provided data is showing in the UI or not
                3. If data is showing then test will pass if not then it  will fail 
         */

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <CallLogs callLogs={callLogs} />
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        )
        const timeStamp = screen.queryByText(/01 Sep 2022/i);
        const description = screen.queryByText(/mark andry/i);

        expect(timeStamp).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    })

    test("Testing when there has internal server error", () => {

        /*
            Purpose of this test :
                1. Rendering with internal server error
                2. Checking if the internal server error animation is showing in the UI or not
                3. If it is showing then test will pass if not then it  will fail 
        */

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <CallLogs callLogsInternalServerError={true} />
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        )
        const internalServerErrorAnimation = screen.queryByTestId(/internal-server-error-animation/i);

        expect(internalServerErrorAnimation).toBeInTheDocument();
    })

})