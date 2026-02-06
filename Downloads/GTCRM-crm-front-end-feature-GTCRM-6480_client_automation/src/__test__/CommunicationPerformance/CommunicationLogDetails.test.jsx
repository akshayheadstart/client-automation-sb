import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CommunicationLogDetails from "../../pages/ApplicationManager/CommunicationLogDetails";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe('test communication logs', () => {
    test("download button render", () => {

        /*
            Purpose of this test :
                1. Rendering and expecting communication log button to be in the document
        */

        render(

            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <CommunicationLogDetails></CommunicationLogDetails>
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        );
        const communicationLogDownloadButton = screen.queryByTestId(
            "communication-Log-details-button"
        );
        expect(communicationLogDownloadButton).toBeTruthy();
    });


})