import { render, screen, act, fireEvent } from "@testing-library/react";
import CreateQuestionForm from "../../pages/ResourceManagement/CreateQuestionForm";
import { expect, vi } from "vitest";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

const mockData = {
  _id: "655b061ea38c594c14e4904e",
  question: "What is the Lorem ipsum?",
  answer:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  tags: ["Tag1", "String1"],
  created_by: "apollo college super",
  created_by_id: "6290c40ee87e304387308492",
  created_at: "20 Nov 2023 12:39:18 PM",
  last_updated_on: "20 Nov 2023 05:06:44 PM",
  last_updated_by: "apollo college super",
  last_updated_by_id: "6290c40ee87e304387308492",
};

describe("GIVEN CreateQuestionForm", () => {
  test("should invoke onSubmit on submit button click with the cancel button", () => {
    const mockOnSubmit = vi.fn();
    render(
      <Provider store={store}>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <CreateQuestionForm
              onSubmit={mockOnSubmit}
              data={mockData}
              isEditQuestionMode
            />
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </Provider>
    );

    const submitBtn = screen.getByText("Save");
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
});
