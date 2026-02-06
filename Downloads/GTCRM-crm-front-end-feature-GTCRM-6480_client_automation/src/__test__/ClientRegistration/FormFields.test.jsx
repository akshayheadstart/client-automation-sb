import { render, screen } from "@testing-library/react"
import FormFields from "../../components/shared/ClientRegistration/FormFields"

describe("Testing Form fields component to be rendered as expected", () => {
    let data = [
        {
            field_name: "Registration",
            field_type: "text",
            is_mandatory: true,
        }
    ]
    test("Testing when edit mode", () => {
        render(<FormFields heading="Name" fieldDetails={data} formFieldsStates={{}} />)

        expect(screen.getByText("Name Fields")).toBeInTheDocument();
        expect(screen.getByText("Registration")).toBeInTheDocument();
        expect(screen.getByText("text")).toBeInTheDocument();
        expect(screen.getByText("Add New Field")).toBeInTheDocument();
    })

    test("Testing when preview mode", () => {
        render(<FormFields heading="Name" fieldDetails={data} formFieldsStates={{}} preview={true} />)
        expect(screen.getByText("Name Fields")).toBeInTheDocument();
        expect(screen.getByText("Registration")).toBeInTheDocument();
        expect(screen.getByText("text")).toBeInTheDocument();
        expect(screen.queryByText("Add New Field")).not.toBeInTheDocument();
    })


})
