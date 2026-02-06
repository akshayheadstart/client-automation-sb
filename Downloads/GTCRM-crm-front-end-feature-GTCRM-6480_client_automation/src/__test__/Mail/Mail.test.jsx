import { store } from "../../Redux/store";
import { Provider } from "react-redux";
import { Suspense } from "react";
import { Box } from "@mui/system";
import Mail from "../../components/userProfile/Mail";
import { render, screen } from "@testing-library/react";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";
const { MemoryRouter } = require("react-router-dom");

test("Mail component test", async () => {
  /*
        Purpose of this test :
            1. Rendering Mail component with open and onClose props
            2. Expecting the title "new message" and cancel button to be shown
            3. One user click on the cancel button the mail component should be invisible
     */

  render(
    <Provider store={store}>
      <Suspense fallback={<Box>Fallback</Box>}>
        <MemoryRouter>
          <DashboardDataProvider>
            <Mail
              email={[]}
              open={true}
              onClose={vi.fn()}
              templateBody={true}
              selectedRawDataUploadHistoryRow={[]}
              payloadForEmail={{}}
              selectedEmails={[]}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Suspense>
    </Provider>
  );

  const newMessageHeading = await screen.findByText(/new message/i);
  const sentButton = await screen.findByText(/send/i);
  const selectTemplate = await screen.findByText(/Select Template/i);
  const mailCancelButton = await screen.findByTestId("mail-cancel-button");

  expect(newMessageHeading).toBeInTheDocument();
  expect(mailCancelButton).toBeInTheDocument();
  expect(sentButton).toBeInTheDocument();
  expect(selectTemplate).toBeInTheDocument();
});
