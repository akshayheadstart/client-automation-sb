import { render, screen } from "@testing-library/react"
import TrendAnalysis from "../../pages/Dashboard/TrendAnalysis"

test("TrendAnalysis component testing", () => {
    /*
        1. Rendering component and expecting the heading exists or not
        2. If exists then it will pass if not then it will fail
     */

    render(<TrendAnalysis />)

    const heading = screen.queryByRole('heading', { name: /Show Trends For/i });
    expect(heading).toBeInTheDocument();
})