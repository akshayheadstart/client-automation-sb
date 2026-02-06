import { render, screen } from "@testing-library/react";
import LeadsViewDialog from "../../pages/Query_Manager/LeadsViewDialog";

describe("LeadsViewDialog Component Test", () => {
    test("Show the content for LeadsViewDialog Component", () => {

        const leads = [{
            "email": "alkendrasingh_1@gmail.com",
            "mobile_number": 7485123652,
            "first_name": "harendra",
            "last_name": "singh",
            "class": 12,
            "section": "B",
            "header": ""
        },
        {
            "email": "cbrr007@gmail.com",
            "mobile_number": 4512689523,
            "first_name": "jitendra",
            "last_name": "chaudhary",
            "class": "BSC",
            "section": "CS",
            "header": "test gea"
        }];

        /*
               Purpose of this test :
                   1. Rendering user LeadsViewDialog component and expecting the heading "Duplicate Leads" and cancel button to be in the document
           */

        render(
            <LeadsViewDialog openDialog={true} title={"Duplicate Leads"} leads={leads} setOpenDialog={false}></LeadsViewDialog>
        );
        const heading = screen.queryByRole("heading", { name: /Duplicate Leads/i });
        const cancelButton = screen.queryByTestId("cancel-button");

        expect(heading).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    });
});
