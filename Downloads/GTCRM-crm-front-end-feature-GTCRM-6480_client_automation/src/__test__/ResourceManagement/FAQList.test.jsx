import { render, screen, fireEvent } from "@testing-library/react";
import FAQList from "../../pages/ResourceManagement/FAQList";
import { vi } from "vitest";

const mockData = [
  {
    _id: "1234",
    question: "What is the Lorem ipsum?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    tags: ["Tag1"],
    created_by: "apollo college super",
    created_by_id: "6290c40ee87e304387308492",
    created_at: "20 Nov 2023 12:39:18 PM",
    last_updated_on: "20 Nov 2023 12:39:18 PM",
    last_updated_by: "apollo college super",
    last_updated_by_id: "6290c40ee87e304387308492",
  },
];

describe("GIVEN FAQList", () => {
  test("should render component", () => {
    render(<FAQList questionsList={mockData} onEditClick={vi.fn()} />);
    expect(screen.getByText("What is the Lorem ipsum?")).toBeInTheDocument();
    expect(screen.getByText("Tag1")).toBeInTheDocument();
  });
  test("should invoke onEditClick", () => {
    const mockHandleEditClick = vi.fn();
    render(
      <FAQList
        questionsList={mockData}
        onEditClick={mockHandleEditClick}
        canUpdate={true}
      />
    );
    const editBtn = screen.getByTestId("editIcon");

    fireEvent.click(editBtn);

    expect(mockHandleEditClick).toHaveBeenCalled();
  });

  test("should invoke onDeleteClick", () => {
    const mockHandleDelete = vi.fn();
    render(
      <FAQList
        questionsList={mockData}
        onDeleteClick={mockHandleDelete}
        canUpdate={true}
      />
    );
    const deleteBtn = screen.getByTestId("deleteIcon");

    fireEvent.click(deleteBtn);

    expect(mockHandleDelete).toHaveBeenCalled();
    expect(mockHandleDelete).toHaveBeenCalledWith(mockData[0]);
  });
});
