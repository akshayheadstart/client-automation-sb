import { render, screen } from "@testing-library/react"
import { Suspense } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SmsAndWhatsapp from "../../components/userProfile/SmsAndWhatsapp"
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

test("Testing SmsAndWhatsapp component to be rendered correctly", () => {
    render(
        /*
            Purpose of this test :
                1. Rendering this component by giving props name "SMS"
                2. Expecting this name to be in the document
        */
        <Provider store={store}>
            <MemoryRouter>
                <DashboardDataProvider>
                    <Suspense fallback={<p>loading..</p>}>
                        <SmsAndWhatsapp name="SMS" openDialogs={true} />
                    </Suspense>
                </DashboardDataProvider>
            </MemoryRouter>
        </Provider>
    )

    const sms = screen.queryByText(/sms/i);

    expect(sms).toBeInTheDocument();
})