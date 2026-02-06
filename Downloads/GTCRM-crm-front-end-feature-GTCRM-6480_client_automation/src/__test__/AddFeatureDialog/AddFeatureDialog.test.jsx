import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import AddFeatureDialog from "../../components/AddFeatureDialog/AddFeatureDialog";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

describe("Show List of Data", () => {
  test("toggles between existed and new", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <AddFeatureDialog
              createFeatureDialogOpen={true}
              handleClose={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    // Click on the 'Feature' button
    const featureButton = screen.getByText("Feature");

    fireEvent.click(featureButton);

    const backButton = screen.getByText("Back");
    const subMenu = screen.getByText("Please Select your Sub Menu?");
    const featureName = screen.getByText("What is your Feature name?");

    expect(backButton).toBeInTheDocument();
    expect(subMenu).toBeInTheDocument();
    expect(featureName).toBeInTheDocument();
    expect(featureButton).not.toBeInTheDocument();

    fireEvent.click(backButton);

    const prevFeatureButton = screen.getByText("Feature");
    expect(prevFeatureButton).toBeInTheDocument();
  });
});
