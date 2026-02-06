import { render, screen } from "@testing-library/react"
import FilterSaveDialog from "../../components/shared/Dialogs/FilterSaveDialog"

test("Testing filterSave dialog to be rendered perfectly", () => {

    /*
        Purpose of this test:
            1. Rendering the filter save dialog with given the props open filterDialog as true
            2. Checking whether the content of the dialog is exists
     */

    render(<FilterSaveDialog openSaveFilterDialog={true} />)
    expect(screen.getByRole("heading", { name: /save filter/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name of the filter/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
})