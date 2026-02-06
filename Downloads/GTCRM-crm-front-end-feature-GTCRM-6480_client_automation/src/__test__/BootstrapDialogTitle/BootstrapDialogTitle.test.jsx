import { render, screen } from "@testing-library/react";
import BootstrapDialogTitle from "../../components/shared/Dialogs/BootsrapDialogsTitle";
import { vi } from "vitest";

test("Testing Bootstrap dialog title component", () => {
  /*
        Purpose of this test :
            1. Rendering this component and checking if the children of this component is showing in the UI or not
            2. If showing then it will pass if not then it will fail
    */
  render(
    <BootstrapDialogTitle onClose={vi.fn()}>
      Assign Leads to Counsellor
    </BootstrapDialogTitle>
  );
  const heading = screen.queryByRole("heading", {
    name: /Assign Leads to Counsellor/i,
  });

  expect(heading).toBeInTheDocument();
});
