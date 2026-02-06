import { render, screen } from "@testing-library/react"
import CommunicationRelease from "../../components/ui/communicationPerformance/CommunicationRelease"

test("Testing communication release component to be rendered", () => {
    render(<CommunicationRelease heading="Manual release" />)
    expect(screen.getByText(/manual release/i)).toBeInTheDocument()
})