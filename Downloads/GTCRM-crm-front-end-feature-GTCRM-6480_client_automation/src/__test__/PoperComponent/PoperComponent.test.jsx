import { render, screen } from "@testing-library/react"
import PoperComponent from "../../components/userProfile/PoperComponent"

test("Rendering popper component with expected data", () => {
    /*
       Purpose of this test :
           1. Rendering by giving title in props
           2. Expecting provided title to be in the document
    */
    render(
        <PoperComponent
            percentage={50} openPopper={true} title={"title of poper"} index={1}
        />);

    const heading = screen.queryByText(/title of poper/i);

    expect(heading).toBeInTheDocument();
})