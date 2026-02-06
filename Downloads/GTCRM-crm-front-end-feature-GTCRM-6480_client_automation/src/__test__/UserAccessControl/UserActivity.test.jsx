import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserActivity from "../../pages/UserAccessControl/UserActivity";

describe("UserActivity component test", () => {
    test("Testing UserActivity Component rendaring", () => {

        /*
            The purpose of this test :  
                1. Testing if UserActivity component render properlly 
        */

        render(
                <MemoryRouter>
                    <UserActivity />
                </MemoryRouter>
        );

        const pageTitle = screen.getByText("Users Activity Logs")
        const filterBy = screen.queryByText("Filter By")
        const helperText = screen.queryByText("Please click search button to view activity")
        const resetButton = screen.queryByRole("button", { name: /Reset/i });
        const searchButton = screen.queryByRole("button", { name: /Search/i });
        const searchLabel = screen.queryByLabelText(/Search By Name/i);


        expect(pageTitle).toBeInTheDocument();
        expect(filterBy).toBeInTheDocument();
        expect(resetButton).toBeInTheDocument();
        expect(searchButton).toBeInTheDocument();
        expect(searchLabel).toBeInTheDocument();
        expect(helperText).toBeInTheDocument();

    });

});




