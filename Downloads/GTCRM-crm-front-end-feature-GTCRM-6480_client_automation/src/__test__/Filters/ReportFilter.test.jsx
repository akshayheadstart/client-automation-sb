import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ReportFilter from "../../components/ui/Report/ReportFilter";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

const selectedFilters = {
  internalServerErrorInReportFilter: false,
  somethingWentWrongInReportFilter: false,
  selectedVerificationStatus: "",
  setSelectedVerificationStatus: vi.fn(),
  selectedState: "",
  setSelectedState: vi.fn(),
  selectedSource: "",
  setSelectedSource: vi.fn(),
  selectedLeadType: "",
  setSelectedLeadType: vi.fn(),
  selectedLeadStage: [],
  setSelectedLeadStage: vi.fn(),
  selectedCounselor: "",
  setSelectedCounselor: vi.fn(),
  selectedApplicationStage: "",
  setSelectedApplicationStage: vi.fn(),
  selectedPaymentStatus: "",
  setSelectedPaymentStatus: vi.fn(),
  selectedLeadStageLabel: [],
};
const renderAllFilter = (type) => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <ReportFilter selectedFilters={selectedFilters} reportType={type} />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText(/state/i)).toBeInTheDocument();
  expect(screen.getByText(/lead type/i)).toBeInTheDocument();
  expect(screen.getByText(/verify status/i)).toBeInTheDocument();
  expect(screen.getByText(/payment status/i)).toBeInTheDocument();
  expect(screen.getByText(/source/i)).toBeInTheDocument();
  expect(screen.getByText(/counselor/i)).toBeInTheDocument();
  expect(screen.getByText(/lead stage/i)).toBeInTheDocument();
  expect(screen.getByText(/application stage/i)).toBeInTheDocument();
};

describe("Testing ReportFilter component", () => {
  test("Testing whether all filter option is showing when 'All Application Data' is given as report type props", () => {
    /*
            Purpose of this test :
                1. Rendering component with giving props value "application report"
                2. Expecting all of the filters to be in the document
        */
    renderAllFilter("Applications");
  });
  test("Testing whether all filter option is showing when 'All Student Data' is given as report type props", () => {
    /*
            Purpose of this test :
                1. Rendering component with giving props value "leads reports"
                2. Expecting all of the filters to be in the document
        */
    renderAllFilter("Leads");
  });
  test("Testing whether all filter option is showing when 'All Payment Data' is given as report type props", () => {
    /*
            Purpose of this test :
                1. Rendering component with giving props value "payment reports"
                2. Expecting payment filter to be in the document
        */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <ReportFilter
              selectedFilters={selectedFilters}
              reportType="Payments"
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/payment status/i)).toBeInTheDocument();
  });
});
