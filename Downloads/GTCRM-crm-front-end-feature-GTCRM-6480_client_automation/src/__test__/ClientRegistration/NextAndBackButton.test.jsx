import { render, screen } from "@testing-library/react"
import NextAndBackButton from "../../components/shared/ClientRegistration/NextAndBackButton"

describe("Testing next and back button to be rendered", () => {
    test("Testing when registration is not available", () => {
        render(<NextAndBackButton />)
        expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    })
    test("Testing when registration is available", () => {
        render(<NextAndBackButton handleClientRegistration={() => { }} />)
        expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
    })
    test("Testing when next button is disabled", () => {
        render(<NextAndBackButton disableNext={true} />)
        expect(screen.queryByRole("button", { name: /register/i })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /next/i })).toBeDisabled();
    })
})