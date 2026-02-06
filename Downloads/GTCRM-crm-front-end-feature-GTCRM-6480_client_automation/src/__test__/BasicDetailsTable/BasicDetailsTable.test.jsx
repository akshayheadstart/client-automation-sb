import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import BasicDetailsTable from "../../components/ui/application-manager/BasicDetailsTable";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";
// import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
const additionalColumnStates = {
  regState: false,
  setRegState: vi.fn(),
  city: false,
  setCity: vi.fn(),
};

const applications = [
  {
    application_id: "630dd8a8acaa91964a2c1602",
    course_name: "BTech in Computer Science and Engineering",
    custom_application_id: "TAU/2022/BTechCSE/0158",
    payment_status: "captured",
    student_email_id: "abid43iiuc@gmail.com",
    student_id: "630dd8a7acaa91964a2c1601",
    student_mobile_no: 1775971698,
    student_name: "Abidur Rahman Chowdhury",
  },
];

describe("Test cases of basicDetailsTable component", () => {
  test("Testing basicDetailsTable component when there has not any error and student data exists", () => {
    /*
            Purpose of this test :
                1. Checking basicDetailsTable component by giving student data.
                2. Then check whether the given data is shown in the UI or not.
                3. If it shows the data then test will pass if not then test will fail.
         */
    const intersectionObserverMock = () => ({
      observe: () => null,
      unobserve: () => null,
    });
    window.IntersectionObserver = vi
      .fn()
      .mockImplementation(intersectionObserverMock);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <BasicDetailsTable
              additionalColumnStates={additionalColumnStates}
              allApplicationInternalServerError={false}
              singleApplicationDownloadInternalServerError={false}
              somethingWentWrongInApplicationDownload={false}
              somethingWentWrongInAllApplication={false}
              items={applications}
              applications={applications}
              loading={false}
              setIsScrolledToPagination={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const checkBox = screen.queryByTestId(/CheckBoxIcon/i);

    expect(checkBox).toBeInTheDocument();
  });

  test("Testing basicDetailsTable component when loading props is true", () => {
    /*
            Purpose of this test :
                1. Checking basicDetailsTable component by setting loading props "true".
                2. Then check whether the component showing the loading animation or not.
                3. If component shows the loading animation then test will pass if not then test will fail.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <BasicDetailsTable
              additionalColumnStates={additionalColumnStates}
              allApplicationInternalServerError={false}
              singleApplicationDownloadInternalServerError={false}
              somethingWentWrongInApplicationDownload={false}
              somethingWentWrongInAllApplication={false}
              applications={applications}
              loading={true}
              setIsScrolledToPagination={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const loadingAnimationContainer = screen.queryByTestId(
      "loading-animation-container"
    );

    expect(loadingAnimationContainer).toBeInTheDocument();
  });
  test("Testing basicDetailsTable component when internalServerError props is true", () => {
    /*
            Purpose of this test :
                1. Checking basicDetailsTable component by setting internalServerError props "true".
                2. Then check whether the component showing the internalServer error animation or not.
                3. If component shows the internalServer error animation then test will pass if not then test will fail.
         */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <BasicDetailsTable
              additionalColumnStates={additionalColumnStates}
              allApplicationInternalServerError={true}
              singleApplicationDownloadInternalServerError={false}
              somethingWentWrongInApplicationDownload={false}
              somethingWentWrongInAllApplication={false}
              applications={applications}
              loading={false}
              setIsScrolledToPagination={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const errorAnimationContainer = screen.queryByTestId(
      "error-animation-container"
    );

    expect(errorAnimationContainer).toBeInTheDocument();
  });
  test("Testing basicDetailsTable component when application's length is 0", () => {
    /*
            Purpose of this test :
                1. Checking basicDetailsTable component by setting applications props as empty array.
                2. Then check whether the component showing the not found animation or not.
                3. If component shows the not found animation then test will pass if not then test will fail.
         */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <BasicDetailsTable
              additionalColumnStates={additionalColumnStates}
              allApplicationInternalServerError={false}
              singleApplicationDownloadInternalServerError={false}
              somethingWentWrongInApplicationDownload={false}
              somethingWentWrongInAllApplication={false}
              applications={[]}
              loading={false}
              setIsScrolledToPagination={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const notFoundAnimationContainer = screen.queryByTestId(
      "not-found-animation-container"
    );

    expect(notFoundAnimationContainer).toBeInTheDocument();
  });
});
