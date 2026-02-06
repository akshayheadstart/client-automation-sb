import { render, screen } from "@testing-library/react"
import ReleaseSourceCount from "../../components/ui/communicationPerformance/ReleaseSourceCount"

test("Testing release source count component to be rendered", () => {
    const details = {
        sent: 5000,
        open_rate: 70,
        click_rage: 30
    }
    render(<ReleaseSourceCount details={details} heading="Email" />)

    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();

})