import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import CampaignManagerTable from "../../components/ui/campaign-manager/CampaignManagerTable"
import { store } from "../../Redux/store"
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext"

describe("Testing campaign manager table component", () => {

    /*
        Purpose of this test: 
            1. Rendering with table head and body as well as the heading
            2. Checking if the given things are showing in the UI or not?
            3. If showing it will pass, if not then it will fail.
     */

    test("Testing by giving normal props", () => {
        const tableBody = [{
            name: "Google",
            leads: 200,
            paid_applications: 50,
            unpaid_applications: 40,
            verified_leads: 50,
        }]
        const tableHead = ["Name", "Total lead"]
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <CampaignManagerTable
                            heading="All source details"
                            tableHead={tableHead}
                            tableBody={tableBody} />
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>
        )
        expect(screen.getByRole("heading", { name: /all source details/i })).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Google")).toBeInTheDocument();
    })
})