import { render, screen } from "@testing-library/react";
import PasswordVisibilityIcon from "../../components/shared/forms/PasswordVisibilityIcon";

test("Should show visible icon by default if props value is not passed", () => {

    /*
                      Purpose of this test :
                          1. Rendering PasswordVisibilityIcon component
                          2. Checking if the component consists the test id "visibility-icon"
                          3. If that found then test will pass if not then fail.
                  */

    render(<PasswordVisibilityIcon />);
    const icon = screen.queryByTestId("visibility-icon");
    expect(icon).toBeInTheDocument();
});

test("Should show invisible icon if props value is true", () => {

    /*
                         Purpose of this test :
                             1. Rendering PasswordVisibilityIcon component
                             2. Checking if the component consists the test id "visibility-off-icon"
                             3. If that found then test will pass if not then fail.
                     */

    render(<PasswordVisibilityIcon value={true} />);
    const icon = screen.queryByTestId("visibility-off-icon");
    expect(icon).toBeInTheDocument();
});

test("Should show visible icon if props value is false", () => {

    /*
                         Purpose of this test :
                             1. Rendering PasswordVisibilityIcon component with props
                             2. Checking if the component consists the test id "visibility-icon"
                             3. If that found then test will pass if not then fail.
                     */

    render(<PasswordVisibilityIcon value={false} />);
    const icon = screen.queryByTestId("visibility-icon");
    expect(icon).toBeInTheDocument();
});

test("show visibilty off icon when value is true", () => {

    /*
                             Purpose of this test :
                                 1. Rendering PasswordVisibilityIcon component with props
                                 2. Checking if the component consists the test id "visibility-off-icon"
                                 3. If that found then test will pass if not then fail.
                         */

    const values = {
        showCurrentPassword: true,
    };
    render(<PasswordVisibilityIcon value={values.showCurrentPassword} />);
    const visibilityOffIcon = screen.getByTestId("visibility-off-icon");
    expect(visibilityOffIcon).toBeInTheDocument();
});

test("show visibilty icon when value is false", () => {

    /*
                                 Purpose of this test :
                                     1. Rendering PasswordVisibilityIcon component with props
                                     2. Checking if the component consists the test id "visibility-icon"
                                     3. If that found then test will pass if not then fail.
                             */

    const values = {
        showCurrentPassword: false,
    };
    render(<PasswordVisibilityIcon value={values.showCurrentPassword} />);
    const visibilityIcon = screen.getByTestId("visibility-icon");
    expect(visibilityIcon).toBeInTheDocument();
});
