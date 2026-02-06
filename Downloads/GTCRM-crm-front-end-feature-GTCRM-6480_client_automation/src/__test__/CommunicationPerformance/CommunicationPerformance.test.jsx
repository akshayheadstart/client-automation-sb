import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CommunicationPerformance from "../../pages/ApplicationManager/CommunicationPerformance";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe("CommunicationPerformance component test", () => {
    test("download button render", () => {

        /*
            Purpose of this test :
                1. Rendering and expecting communication log button to be in the document
        */

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <CommunicationPerformance />
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        );
        const communicationLogDownloadButton = screen.queryByTestId(
            "communication-log-download-button"
        );
        expect(communicationLogDownloadButton).toBeTruthy();
    });

    test("click filter button and drawer open", () => {

        /*
            The purpose of this test :  
                1. In the communicationPerformance component there has a filter button, 
                2. once user click on the button then a  drawer will open with having the text as heading "Filter by".
        */

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <CommunicationPerformance />
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        );
        const communicationLogFilterButton = screen.queryByTestId(
            "communication-log-filter-button"
        );
        fireEvent.click(communicationLogFilterButton);
        const drawerTitle = screen.queryByText(/Filter By/i);
        expect(drawerTitle).toBeInTheDocument();
    });
});