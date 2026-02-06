import { render, screen } from "@testing-library/react"
import PerformanceDetailsCard from "../../components/ui/communicationPerformance/PerformanceDetailsCard"

test("Testing performance details card component to be rendered", () => {
    const data = {
        sent: 500,
    }
    render(<PerformanceDetailsCard data={data} heading="Communication summary" />)

    expect(screen.getAllByText(/Communication summary/i)?.length).toBe(2);
    expect(screen.getAllByText(/500/)?.length).toBe(2);

})