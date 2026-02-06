import { fireEvent, render, screen } from "@testing-library/react";
import UserPermissionTutorial from "../../components/ui/User-Access-Conreoll/UserPermissionTutorial";
import { vi } from "vitest";

describe("User Acess Conreoll Unit test", () => {
  test("user permission tutorial render", () => {
    render(
      <UserPermissionTutorial
        openTutorialDialog={true}
        setOpenTutorialDialog={() => vi.fn()}
      />
    );

    const tutorialTitle1 = screen.queryByText("Check Permission");
    const step1 = screen.queryByText("Step 1");
    const step2 = screen.queryByText("Step 2");
    const step3 = screen.queryByText("Step 3");
    const closeButton = screen.queryByRole("button", { name: "Close" });
    const nextButton = screen.queryByRole("button", { name: "Next" });
    const backButton = screen.queryByRole("button", { name: "Back" });

    expect(tutorialTitle1).toBeInTheDocument();
    expect(step1).toBeInTheDocument();
    expect(step2).toBeInTheDocument();
    expect(step3).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test("User Permission Tutorial next buttons, Back Button and Close Button work properly", () => {
    render(
      <UserPermissionTutorial
        openTutorialDialog={true}
        setOpenTutorialDialog={() => vi.fn()}
      />
    );

    const closeButton = screen.queryByRole("button", { name: "Close" });
    const nextButton = screen.queryByRole("button", { name: "Next" });
    const backButton = screen.queryByRole("button", { name: "Back" });

    fireEvent.click(nextButton);
    const tutorialTitle = screen.queryByText("Give Permission");
    expect(tutorialTitle).toBeInTheDocument();

    const givePermissionNextButton = screen.queryByRole("button", {
      name: "Next",
    });
    fireEvent.click(givePermissionNextButton);

    const tutorialTitle3 = screen.queryByText("Change Permissions");
    expect(tutorialTitle3).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(tutorialTitle3).not.toBeVisible();

    fireEvent.click(closeButton);
    expect(tutorialTitle3).not.toBeVisible();
  });
});
