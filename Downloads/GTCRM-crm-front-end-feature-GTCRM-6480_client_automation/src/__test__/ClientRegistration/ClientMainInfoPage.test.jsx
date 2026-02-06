import { render, screen } from "@testing-library/react";
import ClientMainInfoPage from "../../components/shared/ClientRegistration/ClientMainInfoPage";

test("Testing Client main info page component to be rendered when given data", () => {
  const data = {
    clientName: "asdf",
  };
  render(
    <ClientMainInfoPage
      clientMainPageInfoPageFieldState={data}
      leadStages={[]}
    />
  );
  expect(screen.getByText("Name of Client")).toBeInTheDocument();
  expect(screen.getByText("Address line 1")).toBeInTheDocument();
  expect(screen.getByText("Address line 2")).toBeInTheDocument();
});
