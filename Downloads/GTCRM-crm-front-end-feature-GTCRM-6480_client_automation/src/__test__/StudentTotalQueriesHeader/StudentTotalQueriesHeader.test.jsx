import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import StudentTotalQueriesText from "../../pages/StudentTotalQueries/StudentTotalQueriesText";


describe("Show List of Data", () => {
  test("Testing Active Student Total Queries Component", () => {
    const labelText1 = 'Todays';
    const labelText2 = 'Queries';
    const value = 15;
    render(
      <Provider store={store}>
        <MemoryRouter>
          <StudentTotalQueriesText
          labelText1={labelText1}
          labelText2={labelText2}
          value={value}
           />
        </MemoryRouter>
      </Provider>
    );
    const labelText1Element = screen.getByText(labelText1);
    const labelText2Element = screen.getByText(labelText2);
    const valueElement = screen.getByText(value.toString());

    expect(labelText1Element).toBeInTheDocument();
    expect(labelText2Element).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();

  });
});
