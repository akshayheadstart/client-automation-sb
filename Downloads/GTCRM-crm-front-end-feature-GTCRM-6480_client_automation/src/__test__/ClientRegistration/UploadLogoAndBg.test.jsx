import { render, screen } from "@testing-library/react"
import UploadLogoAndBg from "../../components/shared/ClientRegistration/UploadLogoAndBg"

describe("Testing upload logo and bg component to be rendered", () => {
    test("Testing when the logo and bg is not uploaded", () => {
        render(<UploadLogoAndBg preview={true} />)
        expect(screen.queryByText("Uploaded Logo")).not.toBeInTheDocument();
        expect(screen.queryByText("Upload Logo")).not.toBeInTheDocument()
    })
    test("Testing when the logo and bg is uploaded", () => {
        render(<UploadLogoAndBg logoAndBg={{ logo: "something.jpg" }} />)
        expect(screen.getByText("Uploaded Logo")).toBeInTheDocument();
        expect(screen.getByText("Upload Logo")).toBeInTheDocument();
    })
})