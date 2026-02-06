import FollowupDetails from "../../components/userProfile/FollowupDetails";
const { render, screen } = require("@testing-library/react");

test("Rendering followup details component", () => {
  /*
        Purpose of this test :
            1. Rendering followup details component 
            2. Checking if all the data is showing in the UI or not
            3. If showing then it will pass of not then it will fail.
     */
  const mockupData = {
    followup: new Date().toDateString(),
    followup_note: "Meet with us.",
    assigned_to: "Mohib",
    due: new Date().toDateString(),
    created_by: "Mohib",
    status: "In progress",
  };

  render(<FollowupDetails details={mockupData} />);

  const dates = screen.queryByText(`Followup : ${new Date().toDateString()}`);
  const createdBy = screen.queryByText("Created By : Mohib");
  const assignedTo = screen.queryByText("Assigned to : Mohib");
  const note = screen.queryByText("Note : Meet with us.");
  const status = screen.queryByText("Status : In progress");

  expect(dates).toBeInTheDocument();
  expect(assignedTo).toBeInTheDocument();
  expect(createdBy).toBeInTheDocument();
  expect(note).toBeInTheDocument();
  expect(status).toBeInTheDocument();
});
