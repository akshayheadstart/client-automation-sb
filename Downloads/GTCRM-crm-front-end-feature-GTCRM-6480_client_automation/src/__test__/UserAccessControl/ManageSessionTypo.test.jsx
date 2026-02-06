import { render, screen } from "@testing-library/react"
import ManageSessionTypo from "../../components/ui/User-Access-Conreoll/ManageSessionTypo"

test("Testing manage session typo component to be rendered", () => {

    // we are testing in this component to be rendered perfectly with the given props typo and show the given content to the UI or not?

    render(<ManageSessionTypo typo="hello world" />)
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
})