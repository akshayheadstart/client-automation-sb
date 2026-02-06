import { render, screen } from "@testing-library/react"
import CommunicationTrendsTable from "../../components/ui/communicationPerformance/CommunicationTrendsTable"

describe("Testing CommunicationTrendsTable component to be render as expected", () => {

    const emailTableHeading = ["segment name", "sent", "opened", "open rate", "clicked", "clicked rate"];
    const smsAndWhatsappHeading = ["segment name", "sent", "delivered", "delivered rate"]

    test("Testing when email tab is activated", () => {
        /*
            Purpose:
                1. testing by giving activated props as "Email",
                2. Checking if the email table's heading and data are rendered or not
        */

        render(<CommunicationTrendsTable activated="email" heading={emailTableHeading} tableData={[]} />)

        expect(screen.getByText(/clicked rate/i)).toBeInTheDocument();
        expect(screen.getAllByText(/clicked/i).length).toBe(2);
        expect(screen.getByText(/open rate/i)).toBeInTheDocument();
        expect(screen.getByText(/opened/i)).toBeInTheDocument();
    })
    test("Testing when email tab is not activated", () => {
        /*
            Purpose:
                1. testing by giving activated props as "SMS",
                2. Checking if the SMS table's heading and data are rendered or not
        */

        render(<CommunicationTrendsTable activated="SMS" heading={smsAndWhatsappHeading} tableData={[]} />)

        expect(screen.getByText(/delivered rate/i)).toBeInTheDocument();
        expect(screen.getAllByText(/delivered/i).length).toBe(2);
        expect(screen.getByText(/sent/i)).toBeInTheDocument();
        expect(screen.getByText(/segment name/i)).toBeInTheDocument();
    })

})