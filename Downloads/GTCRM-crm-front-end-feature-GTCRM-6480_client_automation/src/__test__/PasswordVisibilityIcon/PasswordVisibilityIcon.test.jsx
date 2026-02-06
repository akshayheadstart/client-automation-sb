import { render, screen } from "@testing-library/react"
import PasswordVisibilityIcon from "../../components/ui/PasswordVisibility/PasswordVisibilityIcon"

describe("Testing PasswordVisibilityIcon component", () => {
    test("Test when value props is true", () => {

        /*
             Purpose of this test :
                1. Rendering component with value true
                2. Expect if the password invisible icon exists or not
                3. If exits then test will pass if not it will fail
        */

        render(<PasswordVisibilityIcon value={true} />)
        const invisibleIcon = screen.queryByTestId("visibility-off-icon");
        expect(invisibleIcon).toBeInTheDocument();
    })
    test("Test when value props is false", () => {

        /*
             Purpose of this test :
                1. Rendering component with value false
                2. Expect if the password visible icon exists or not
                3. If exits then test will pass if not it will fail
        */
        render(<PasswordVisibilityIcon value={false} />)
        const visibleIcon = screen.queryByTestId("visibility-icon");
        expect(visibleIcon).toBeInTheDocument();
    })

})