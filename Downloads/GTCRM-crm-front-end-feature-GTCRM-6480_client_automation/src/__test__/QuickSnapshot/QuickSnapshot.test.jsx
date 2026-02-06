import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QuickSnapshot from "../../pages/UserAccessControl/QuickSnapshot";
import MockTheme from "../MockTheme";

test("Testing QuickSnapshot component", () => {
  /*
        Purpose of this test :
            1. Rendering this component and check if the heading user manager, quic Snapshot button and college user link exists or not
            2. If exists then it will pass if not then it will fail
     */

  render(
    <MemoryRouter>
      <MockTheme>
        <QuickSnapshot />
      </MockTheme>
    </MemoryRouter>
  );

  const userManager = screen.queryByRole("heading", { name: /user manager/i });
  const quicSnapshotBtn = screen.queryByRole("button", {
    name: /Quick Snapshot/i,
  });
  const collegeUser = screen.queryByRole("link", { name: /College User/i });

  expect(userManager).toBeInTheDocument();
  expect(quicSnapshotBtn).toBeInTheDocument();
  expect(collegeUser).toBeInTheDocument();
});
