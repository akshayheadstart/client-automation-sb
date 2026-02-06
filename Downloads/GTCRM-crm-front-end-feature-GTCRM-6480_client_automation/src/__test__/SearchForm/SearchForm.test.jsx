import { render, screen } from "@testing-library/react"
import SearchForm from "../../components/ui/trend-analysis/SearchForm"

test("Testing searchForm component", () => {

    /*
        Purpose of this test :
            1. Rendering this component and expecting the following text message and input field with having label text "select form" should be in the document
     */
    render(<SearchForm />)
    const textMessage = screen.queryByText(/Please select your university/i);
    const selectForm = screen.queryByLabelText(/Select Form/i);

    expect(textMessage).toBeInTheDocument();
    expect(selectForm).toBeInTheDocument();

})