import { render, screen, act, fireEvent } from "@testing-library/react";
import CategoriesList from "../../pages/ResourceManagement/CategoriesList";
import { expect, vi } from "vitest";

describe("GIVEN CategoriesList", () => {
  test("should invoke add function", () => {
    const mockHandleAddKeyCategory = vi.fn();
    const { debug } = render(
      <CategoriesList
        handleAddKeyCategory={mockHandleAddKeyCategory}
        canUpdate={true}
      />
    );
    const addBtn = screen.getByText("Add Category");
    fireEvent.click(addBtn);
    expect(mockHandleAddKeyCategory).toBeCalled();
  });
});
