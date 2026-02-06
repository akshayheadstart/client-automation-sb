import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import FollowUpAndNotes from "../../components/userProfile/FollowUpAndNotes";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

const followUpData = [
  {
    assigned_to: "Tesing",
    created_by: "string string string",
    due: "30 Aug 2022 04:06 PM",
    followup: "with Abidur Rahman Chowdhury",
    followup_note: "",
    status: "Incomplete",
    timestamp: "30 Aug 2022 03:36 PM",
  },
];
describe("Testing followUpAdnNotes component", () => {
  test("Rendering component with followUpData", () => {
    /*
            Purpose of this test :
                1. Rendering by giving followUpData  in props
                2. Expecting provided data to be in the document
        */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <FollowUpAndNotes />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const showMergeLead = screen.queryByText(/Show Merged Details/i);
    const action = screen.queryByText(/Action/i);

    expect(showMergeLead).toBeInTheDocument();
    expect(action).toBeInTheDocument();
  });
});
