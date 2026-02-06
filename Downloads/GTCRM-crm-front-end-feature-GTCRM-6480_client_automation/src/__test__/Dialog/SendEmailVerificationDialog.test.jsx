import { render, screen } from "@testing-library/react";
import SendEmailVerificationDialog from "../../components/shared/Dialogs/SendEmailVerificationDialog";
import { Provider } from "react-redux";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

const selectedApplications = [
  {
    application_id: "647d7aab0d95b72a30892f03",
    student_id: "647d7aab0d95b72a30892f02",
    student_name: "Test Verification",
    custom_application_id: "TAU/2023/BTechAIDS/0091",
    course_name: "B.Tech. in CSE-Artificial Intelligence and Data Science",
    student_email_id: "foxof50049@soremap.com",
    student_mobile_no: "6787808089",
    payment_status: "",
    extra_fields: {},
  },
];

test("Testing SendEmailVerificationDialog details dialog", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DashboardDataProvider>
          <SendEmailVerificationDialog
            open={true}
            handleClose={vi.fn()}
            selectedEmails={["abc@gmail.com"]}
            setSelectedApplications={selectedApplications}
            localStorageKey={"adminSelectedApplications"}
          />
        </DashboardDataProvider>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText("Are you sure , you want to send verification link?")
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
});
