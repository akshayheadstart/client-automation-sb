import { render, screen } from "@testing-library/react"
import TimeLine from "../../components/userProfile/TimeLine"

const timeLineData = [
    {
        assigned_to: "vakado jaysko",
        created_by: "apollo college super",
        due: "05 Sep 2022 01:01 AM",
        followup: "New followup",
        followup_note: "asf",
        status: "Incomplete",
        timestamp: "05 Sep 2022 12:31 AM"
    }
]
test("Testing Timeline component with data", () => {

    /*
       Purpose of this test :
           1. Rendering component with internal server error
           2. Expecting internal server  to be shown in the UI
           3. If animation is now showing it will fail
    */

    render(<TimeLine timeLineData={timeLineData} />)

    const followup = screen.queryByText(/new followup/i)
    const status = screen.queryByText(/incomplete/i);
    const createdBy = screen.queryByText(/apollo college super/i);

    expect(followup).toBeInTheDocument()
    expect(status).toBeInTheDocument()
    expect(createdBy).toBeInTheDocument()
})