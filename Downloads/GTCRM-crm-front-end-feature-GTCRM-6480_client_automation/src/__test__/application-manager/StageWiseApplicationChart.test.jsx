import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import StageWiseApplicationChart from "../../components/ui/application-manager/chartjs/StageWiseApplicationChart";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe("StateWiseApplicationChart component render", () => {
    test("Testing StateWiseApplicationChart rendaring", () => {

        /*
                The purpose of this test :  
                    1. Testing if StateWiseApplicationChart component render properly.
            */

        render(
            <MemoryRouter>
                <Provider store={store} >
                    <DashboardDataProvider>
                        <StageWiseApplicationChart />
                    </DashboardDataProvider>
                </Provider>
            </MemoryRouter>
        );

        const title = screen.queryByText("Stage-wise Application")
        expect(title).toBeInTheDocument();

    });

});

