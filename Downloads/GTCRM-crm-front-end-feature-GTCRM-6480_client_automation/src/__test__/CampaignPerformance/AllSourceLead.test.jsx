import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import AllSourceLeads from "../../pages/CampaignPerformance/AllSourceLeads";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

test("Testing all source lead component to be rendered", () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <DashboardDataProvider>
                    <AllSourceLeads />
                </DashboardDataProvider>
            </MemoryRouter>
        </Provider>
    )
    expect(screen.getByText(/all source leads/i)).toBeInTheDocument();
})