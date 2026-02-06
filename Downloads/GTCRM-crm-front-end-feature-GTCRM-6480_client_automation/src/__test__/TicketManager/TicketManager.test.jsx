import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import TicketManager from "../../components/userProfile/TicketManager";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";



describe("Testing Ticket Manager Component", () => {
  test("Show the content for Ticket Manager Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <TicketManager></TicketManager>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Tickets Manager/i)).toBeInTheDocument();
  });
});
