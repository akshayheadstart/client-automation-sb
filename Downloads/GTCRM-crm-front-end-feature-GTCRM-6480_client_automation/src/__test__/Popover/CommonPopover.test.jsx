import { Typography } from "@mui/material";
import { render, screen } from "@testing-library/react";
import CommonPopover from "../../components/shared/Popover/CommonPopover";
import { vi } from "vitest";

describe("CommonPopover component test", () => {
  test("Testing CommonPopover Component rendering", () => {
    /*
            The purpose of this test :  
                1. Testing if CommonPopover component render properly 
        */

    render(
      <CommonPopover
        setSelectedItem={() => vi.fn()}
        handleClose={() => vi.fn()}
        id={"simple-popover"}
        open={true}
      >
        <Typography>Test popover</Typography>
      </CommonPopover>
    );

    const applyButton = screen.getByRole("button", { name: "Apply" });
    const resetButton = screen.getByRole("button", { name: "Reset" });
    const title = screen.getByText("Test popover");

    expect(applyButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });
});
