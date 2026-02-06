import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import TemplatesTutorial from "../../pages/TemplateManager/TemplatesTutorial";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

describe("Test Basic Layout Page Overlay Tutorial", () => {
  test("TemplatesTutorial component test", () => {
    /*
            The purpose of this test :  
                1. In the TemplatesTutorial component there has an popover tutorial with next and skip button, 
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <TemplatesTutorial
              allTemplateTutorial={true}
              allTemplateTutorialId="id"
              allTemplateTutorialOpen={true}
              handleAllTemplatesTutorialNext={() => vi.fn()}
              handleYourTemplatesTutorialNext={() => vi.fn()}
              yourTemplatesTutorial={true}
              yourTemplatesTutorialOpen={true}
              yourTemplatesTutorialId="id 2"
              handleYourTemplatesTutorialBack={() => vi.fn()}
              draftTemplatesTutorialId="id 3"
              draftTemplatesTutorialOpen={true}
              draftTemplatesTutorial={true}
              handleDraftTemplatesTutorialNext={() => vi.fn()}
              handleDraftTemplatesTutorialBack={() => vi.fn()}
              searchTemplatesTutorialId="id 4"
              searchTemplatesTutorialOpen={true}
              searchTemplatesTutorial={true}
              handleSearchTemplatesTutorialNext={() => vi.fn()}
              handleSearchTemplatesTutorialBack={() => vi.fn()}
              createTemplatesTutorialId="id 5"
              createTemplatesTutorialOpen={true}
              createTemplatesTutorial={true}
              handleCreateTemplatesTutorialBack={() => vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const allTemplatesTutorialTitle = screen.getByText("See All Templates");
    const yourTemplatesTutorialTitle = screen.getByText("See Your Templates");
    expect(allTemplatesTutorialTitle).toBeInTheDocument();
    expect(yourTemplatesTutorialTitle).toBeInTheDocument();

    const draftTemplatesTutorialTitle = screen.getByText("See Draft Templates");
    expect(draftTemplatesTutorialTitle).toBeInTheDocument();

    const searchTemplatesTutorialTitle = screen.getByText("Search Templates");
    expect(searchTemplatesTutorialTitle).toBeInTheDocument();

    const createTemplatesTutorialTitle = screen.getByText("Create Templates");
    expect(createTemplatesTutorialTitle).toBeInTheDocument();

    const tutorialBackButton = screen.queryByRole("button", { name: /Back/i });
    expect(tutorialBackButton).toBeInTheDocument();
  });
});
