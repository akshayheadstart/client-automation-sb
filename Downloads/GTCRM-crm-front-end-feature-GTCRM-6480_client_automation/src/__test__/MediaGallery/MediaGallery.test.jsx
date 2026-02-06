import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import MediaGallery from "../../pages/TemplateManager/MediaGallery";
import ViewMediaGallery, {
  mediaTypeFilters,
  userFilterData,
} from "../../pages/TemplateManager/ViewMediaGallery";

import AllMediaGalleryFileSection from "../../pages/TemplateManager/AllMediaGalleryFileSection";

import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Media gallery render properly", () => {
  test("render", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <MediaGallery />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Drop Files to upload")).toBeInTheDocument();
  });
});

describe("ViewMediaGallery interactions", () => {
  const mockOnFilterChange = vi.fn();
  const defaultProps = {
    filesData: [],
    hideMediaFiles: false,
    isFetching: false,
    onFilterChange: mockOnFilterChange,
    filterParams: {
      media_type: [],
      uploaded_by: [],
      search: "",
      date_range: { start_date: null, end_date: null },
    },
    mediaFilesListSomethingWentWrong: false,
    mediaFilesListInternalServerError: false,
  };

  afterEach(() => {
    mockOnFilterChange.mockClear();
  });

  it("renders correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <ViewMediaGallery {...defaultProps} />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const viewAll = screen.queryByTestId("Media-Type-Select");
    expect(viewAll).toBeInTheDocument();
  });

  it("handles media type change", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <ViewMediaGallery {...defaultProps} />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const MediaType = screen.queryByTestId("Media-Type-Select");

    expect(MediaType).toBeInTheDocument();

    fireEvent.change(MediaType, {
      target: { media_type: ["Video"] },
    });
  });

  it("handles uploaded by change", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <ViewMediaGallery {...defaultProps} />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const UploadedBy = screen.queryByTestId("Uploaded-By-Select");

    fireEvent.change(UploadedBy, {
      target: { uploaded_by: ["apollo@example.com"] },
    });
  });
});

describe("AllMediaGalleryFileSection", () => {
  const mockAllFiles = [
    {
      id: 1,
      file_name: "test.jpg",
      file_extension: ".jpg",
      media_url: "http://example.com/test.jpg",
    },
    {
      id: 2,
      file_name: "test.pdf",
      file_extension: ".pdf",
      media_url: "http://example.com/test.pdf",
    },
  ];

  describe("AllMediaGalleryFileSection", () => {
    const mockAllFiles = [
      {
        id: 1,
        file_name: "test.jpg",
        file_extension: ".jpg",
        media_url: "http://example.com/test.jpg",
      },
      {
        id: 2,
        file_name: "test.pdf",
        file_extension: ".pdf",
        media_url: "http://example.com/test.pdf",
      },
    ];

    const renderComponent = (props = {}) => {
      return render(
        <Provider store={store}>
          <MemoryRouter>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <AllMediaGalleryFileSection
                  allfiles={mockAllFiles}
                  isFetching={false}
                  {...props}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MemoryRouter>
        </Provider>
      );
    };

    it("renders files correctly", () => {
      renderComponent();
      expect(screen.getByText("test.jpg")).toBeInTheDocument();
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });

    it("shows loader when fetching", () => {
      renderComponent({ isFetching: true });
      expect(
        screen.getByTestId("not-found-animation-container")
      ).toBeInTheDocument();
    });

    it("handles file selection", async () => {
      renderComponent();
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);

      await waitFor(() => {
        expect(screen.getByText("1 selected")).toBeInTheDocument();
      });
    });

    it("shows delete and download options when files are selected", async () => {
      renderComponent();
      const checkbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText("Delete")).toBeInTheDocument();
        expect(screen.getByText("Download")).toBeInTheDocument();
      });
    });

    it("opens delete modal when delete option is clicked", async () => {
      renderComponent();
      const checkbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(checkbox);

      await waitFor(() => {
        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);
        expect(
          screen.getByText("Are you sure , you want to delete?")
        ).toBeInTheDocument();
      });
    });
  });
});
