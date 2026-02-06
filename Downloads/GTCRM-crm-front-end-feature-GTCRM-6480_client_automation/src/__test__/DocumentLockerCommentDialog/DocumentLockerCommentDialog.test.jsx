import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { store } from "../../Redux/store";
import DocumentLockerCommentDialog from "../../components/DocumentLockerCommentDialog/DocumentLockerCommentDialog";
import { vi } from "vitest";

describe("Show List of Data", () => {
  test("Testing show data Modal Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DocumentLockerCommentDialog open={true} handleClose={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const element = screen.getByTestId("cancelButtonModalDocumentComment");
    expect(element).toBeInTheDocument();
  });
});
