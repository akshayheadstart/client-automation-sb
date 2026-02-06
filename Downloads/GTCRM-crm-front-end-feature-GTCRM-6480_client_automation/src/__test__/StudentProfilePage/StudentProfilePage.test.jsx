import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import StudentProfilePage from "../../components/shared/StudentProfilePage/StudentProfilePage";

describe("Show List of Data", () => {
  test("Testing show data Modal Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <StudentProfilePage
            studentInfoData={{ download_application: true }}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getAllByText("Download Application").length).toBe(2);
    expect(screen.getByText("0000000000")).toBeInTheDocument();
    expect(screen.getByText("Student Name")).toBeInTheDocument();
  });
});
