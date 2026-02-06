import { render, screen } from "@testing-library/react";
import AutomationDownloadDialog from "../../pages/ApplicationManager/AutomationDownloadDialog";
import { vi } from "vitest";

describe("AutomationDownloadDialog component test", () => {
  test("AutomationDownloadDialog component render", () => {
    /*
            Purpose of this test :
                1. Rendering and expecting dialog title and cancel button to be in the document
        */

    render(
      <AutomationDownloadDialog
        openDialog={true}
        handleCloseDialog={true}
        handleDownload={() => vi.fn()}
        selectedItems={["2225521666abg"]}
      />
    );
    const dialogTitle = screen.queryByTestId("download-dialog-title");
    const cancelButton = screen.queryByRole("button", { name: /Cancel/i });
    expect(dialogTitle).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });
});
