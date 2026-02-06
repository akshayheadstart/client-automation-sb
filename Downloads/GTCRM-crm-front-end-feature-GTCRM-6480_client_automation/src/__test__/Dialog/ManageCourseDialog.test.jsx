import { render, screen, act, fireEvent } from "@testing-library/react";

import ManageCourseDialog from "../../components/shared/Dialogs/ManageCourseDialog";
import { vi } from "vitest";

describe("GIVEN ManageCourseDialog", () => {
  test("should render dialog component", () => {
    const dialogTitle = "Test Dialog";
    render(
      <ManageCourseDialog open={true} onClose={vi.fn()} title={dialogTitle}>
        <div>test content</div>
      </ManageCourseDialog>
    );

    expect(screen.getByText(dialogTitle)).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  test("should not render dialog component when open is false", () => {
    const dialogTitle = "Test Dialog";
    render(
      <ManageCourseDialog open={false} onClose={vi.fn()} title={dialogTitle}>
        <div>test content</div>
      </ManageCourseDialog>
    );

    expect(screen.queryByText(dialogTitle)).not.toBeInTheDocument();
  });

  test("should invoke onclose function When close icon clicked", () => {
    const mockClose = vi.fn();
    render(
      <ManageCourseDialog open={true} onClose={mockClose} title="Test Dialog">
        <div>Test content</div>
      </ManageCourseDialog>
    );
    const closeIconBtn = screen.getByTestId("closeBtn");
    act(() => fireEvent.click(closeIconBtn));

    expect(mockClose).toHaveBeenCalled();
  });
});
