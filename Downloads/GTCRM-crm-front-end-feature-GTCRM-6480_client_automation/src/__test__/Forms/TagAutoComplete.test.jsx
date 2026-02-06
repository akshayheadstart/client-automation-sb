import { render, screen } from "@testing-library/react";
import TagAutoComplete from "../../components/shared/forms/TagAutoComplete";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";

describe("Test Sharable Tag component", () => {
  test("Tag component component rendering test", () => {
    render(
      <Provider store={store}>
        <TagAutoComplete
          label="Search By Tags"
          tags={["tag1"]}
          allTags={["tag1"]}
          setAllGetTags={() => {}}
          errorTagField={""}
          setErrorTagField={() => {}}
          setCallAPI={() => {}}
        ></TagAutoComplete>
      </Provider>
    );

    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
  });
});
