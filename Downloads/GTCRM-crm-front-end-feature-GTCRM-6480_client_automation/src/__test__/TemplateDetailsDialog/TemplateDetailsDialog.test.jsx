import { render, screen } from "@testing-library/react"
import TemplateDetailsDialog from "../../pages/ApplicationManager/TemplateDetailsDialog"

const templateDetails = {
    sms: {
        template_id: "635107284e7231ddc011e8a5",
        template_name: "hello sms",
        template_content: "Hello",
        dlt_content_id: "12345"
    }
}

test("Testing template details dialog", () => {
    render(<TemplateDetailsDialog templateDetails={templateDetails} typeOfTemplate={"sms"} openDialog={true} />)
    expect(screen.getByText("Template Details")).toBeInTheDocument();
    expect(screen.getByTestId("sms-template-content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
})