import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import DocumentLocker from "../../components/userProfile/DocumentLocker";
import { render, screen } from "@testing-library/react";

const studentUploadedDocumentData = {
  courseName: "Bsc",
  studentUploadedDocuments: {
    tenth: {
      file_name: "Soft Manual.pdf",
      file_s3_url:
        "https://devstudentdocumentssb.s3..amazonaws.com/783b7cf31a96a4.pdf",
    },
    inter: {
      file_name: "Soft SkillsManual.pdf",
      file_s3_url: "https://devstudentdocumentssb.s3.ap-south-1..pdf",
    },
    graduation: {
      file_name: "Soft Developer's Life Manual.pdf",
      file_s3_url:
        "https://devstudentdocumentssb.783b7cf31a634082b52376341ecd96a4.pdf",
    },
  },
};
const userProfileLeadsDetails = {
  application_download_url: "",
};

describe("Testing document locker component", () => {
  test("Testing component when there has not any error and data is given", () => {
    /*
            Purpose of this test :
                1. Rendering document locker component with student documents
                2. Expecting whether the document name exist in the ui or not
                2. Also check if the download button of the document is enable or not 
         */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <DocumentLocker
              studentUploadedDocumentData={studentUploadedDocumentData}
              userProfileLeadsDetails={userProfileLeadsDetails}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const providedApplicationName = screen.queryByText(/Notify Student/);
    const download = screen.queryByText(/Download All/);
    const tenthFileName = screen.queryByText(/Soft Manual.pdf/i);
    const interFileName = screen.queryByText(/Soft SkillsManual.pdf/i);
    const graduationFileName = screen.queryByText(
      /Soft Developer's Life Manual.pdf/i
    );
    expect(providedApplicationName).toBeInTheDocument();
    expect(interFileName).toBeInTheDocument();
    expect(graduationFileName).toBeInTheDocument();
    expect(tenthFileName).toBeInTheDocument();
    expect(download).toBeInTheDocument();
  });

  test("Testing component when there has internal server error", () => {
    /*
            Purpose of this test :
                1. Rendering document locker component when internal server error occurs
                2. Expecting whether the internal server error animation showing in the UI or not
                3. if showing then test will pass otherwise test will fail 
         */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <DocumentLocker
              studentUploadedDocumentData={studentUploadedDocumentData}
              userProfileLeadsDetails={userProfileLeadsDetails}
              documentLockerInternalServerError={true}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const internalServerErrorAnimation = screen.queryByTestId(
      /internal-server-error-animation/i
    );
    expect(internalServerErrorAnimation).toBeInTheDocument();
  });
});
