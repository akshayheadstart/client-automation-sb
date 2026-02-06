import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import SourceWiseDetailsChart from "../../pages/CampaignManager/SourceWiseDetailsChart"
import { store } from "../../Redux/store"
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext"

test("Testing source wise details chart component to be rendered correctly", () => {
    /*
        Purpose of this test : 
            1. Rendering by the props listOfSources.
            2. Checking by clicking on the select picker that the given props has been shown in the UI or not.
            3. If showing then it will pass if not then it will fail.
     */
    render(
        <Provider store={store}>
            <MemoryRouter>
                <DashboardDataProvider>
                    <SourceWiseDetailsChart listOfSources={[{ label: "google", value: "google" }]} />
                </DashboardDataProvider>
            </MemoryRouter>
        </Provider>
    )
    expect(screen.getByText(/source wise details/i)).toBeInTheDocument();
    const selectPicker = screen.getByText(/select source/i);
    fireEvent.click(selectPicker);
    expect(screen.getByText('google')).toBeInTheDocument();

})