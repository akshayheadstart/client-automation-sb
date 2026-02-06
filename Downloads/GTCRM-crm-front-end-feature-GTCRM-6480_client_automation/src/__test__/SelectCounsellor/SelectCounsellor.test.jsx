import { render, screen } from "@testing-library/react"
import SelectCounsellor from "../../components/shared/SelectCounsellor/SelectCounsellor"

test("Testing SelectCounsellor component by giving expected data", () => {
    render(<SelectCounsellor />)
    const selectCounsellor = screen.queryByLabelText(/select counselor/i);
    expect(selectCounsellor).toBeInTheDocument()
})