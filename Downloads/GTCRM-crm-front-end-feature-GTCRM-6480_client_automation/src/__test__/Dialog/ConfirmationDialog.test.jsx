import { render, screen, act, fireEvent } from "@testing-library/react";

import ConfirmationDialog from "../../components/shared/Dialogs/ConfirmationDialog";
import { vi } from "vitest";

describe("GIVEN ConfirmationDialog", () => {
  test("should render dialog component", () => {
    const dialogTitle = "Test Dialog";
    const msg = "test message";
    render(
      <ConfirmationDialog
        open={true}
        onClose={vi.fn()}
        title={dialogTitle}
        message={msg}
      ></ConfirmationDialog>
    );
    expect(screen.getByText(dialogTitle)).toBeInTheDocument();
    expect(screen.getByText(msg)).toBeInTheDocument();
  });
  test("should not render dialog component when open is false", () => {
    const dialogTitle = "Test Dialog";
    render(
      <ConfirmationDialog
        open={false}
        onClose={vi.fn()}
        title={dialogTitle}
        message="test message"
      ></ConfirmationDialog>
    );
    expect(screen.queryByText(dialogTitle)).not.toBeInTheDocument();
  });
});
