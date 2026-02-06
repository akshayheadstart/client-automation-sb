import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CounselorManagerDialog from "../../components/shared/Dialogs/CounselorManagerDialog";
import { store } from "../../Redux/store";
import { vi } from "vitest";
test("Testing CounselorManager dialog to be rendered as expected", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CounselorManagerDialog open={true} setOpen={() => vi.fn()} />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText("UPDATE COUNSELOR HOLIDAY")).toBeInTheDocument();
  expect(screen.getByText("Multiple or range?")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
});
