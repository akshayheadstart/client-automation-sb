import { render, screen } from "@testing-library/react"
import ReportDetailsDialog from "../../components/ui/Report/ReportDetailsDialog"

const details = {
    report_name: "Testing report name",
    report_details: "Description here",
    payload: {
        state_names: ["Andaman"],
    }
}

test("Testing report details dialog", () => {
    render(<ReportDetailsDialog details={details} open={true} />)
    expect(screen.getByText("Andaman")).toBeInTheDocument();
    expect(screen.getByText("Testing report name")).toBeInTheDocument();
    expect(screen.getByText("Description here")).toBeInTheDocument();
    expect(screen.getAllByText("N/A").length > 1).toBeTruthy();
})