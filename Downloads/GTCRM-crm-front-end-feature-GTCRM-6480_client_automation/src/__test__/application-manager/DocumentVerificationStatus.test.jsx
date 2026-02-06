import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DocumentVerificationStatus from "../../components/ui/application-manager/table-cell/DocumentVerificationStatus";

const dataRow = {
  application_id: "647ebaf46dde1404e9dc860d",
  student_id: "647eba8b55a7be1c9dec383d",
  student_name: "Testing Twelve adfs",
  custom_application_id: "TAU/2023/BScPA/0041",
  course_name: "B.Sc. in Physician Assistant",
  student_email_id: "kilive7005@peogi.com",
  student_mobile_no: "5658596850",
  payment_status: "",
  extra_fields: {},
  verification: {
    DV_status: "Verified",
  },
};

describe("DocumentVerificationStatus component render", () => {
  test("Testing DocumentVerificationStatus rendering", () => {
    render(
      <MemoryRouter>
        <DocumentVerificationStatus dataRow={dataRow} applicationIndex={1} />
      </MemoryRouter>
    );

    const arrow = screen.getByTestId("down-arrow");
    expect(arrow).toBeInTheDocument();
  });
});
