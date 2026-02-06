import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import DraggableDialog from "../../components/shared/Dialogs/DraggableDialog";

test("Testing the telephony dialog to be rendered as expected with data", () => {
  const minimizedCalls = [
    { student_phone: "1234567891", student_name: "Jhon" },
  ];
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MockTheme>
          <DashboardDataProvider>
            <LayoutSettingProvider>
                {" "}
                <DraggableDialog minimizedCalls={minimizedCalls} />{" "}
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MockTheme>
      </MemoryRouter>
    </Provider>
  );
  const dialogTitle = screen.getByText("Jhon");
  const dialogAction = screen.getByText("+91-1234567891");
  expect(dialogTitle).toBeInTheDocument();
  expect(dialogAction).toBeInTheDocument();
});
