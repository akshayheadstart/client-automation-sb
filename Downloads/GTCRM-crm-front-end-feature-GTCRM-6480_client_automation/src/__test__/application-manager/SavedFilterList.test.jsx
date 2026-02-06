import { render, screen } from "@testing-library/react";
import WarningMessage from "../../components/ui/application-manager/form/FormHelperText";

test("testing formHelper text component to be rendered", () => {
  render(<WarningMessage message="Filter wont't work" />);
  expect(screen.getByText("Filter wont't work")).toBeInTheDocument();
});
