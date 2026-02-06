import { Box } from "@mui/material";
import React, { useState } from "react";
import EmailIcon from "../../../icons/contact-email-icon.svg";
import PhoneIcon from "../../../icons/contact-phone-icon.svg";
import OutboundCallDialog from "../../shared/Dialogs/OutboundCallDialog";
function StudentContact({ dataRow, publisher, maskEmail }) {
  const [openCallDialog, setOpenCallDialog] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img src={EmailIcon} alt="email-icon" />
        <>
          {publisher
            ? dataRow?.student_email_id
              ? maskEmail(dataRow?.student_email_id)
              : `– –`
            : dataRow[
                `${
                  dataRow?.student_email_id
                    ? "student_email_id"
                    : "student_email"
                }`
              ]
            ? dataRow[
                `${
                  dataRow?.student_email_id
                    ? "student_email_id"
                    : "student_email"
                }`
              ]
            : `– –`}
        </>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img src={PhoneIcon} alt="phone-icon" />
        <span
          style={{
            cursor:
              typeof dataRow?.application_id === "string" ? "pointer" : "",
          }}
          onClick={() => {
            if (typeof dataRow?.application_id === "string") {
              setOpenCallDialog(true);
            }
          }}
        >
          {publisher
            ? dataRow?.student_mobile_no
              ? dataRow?.student_mobile_no?.toString().substring(0, 5) + "*****"
              : `– –`
            : dataRow[
                `${
                  dataRow.student_mobile_no
                    ? "student_mobile_no"
                    : "student_mobile_number"
                }`
              ]
            ? dataRow[
                `${
                  dataRow.student_mobile_no
                    ? "student_mobile_no"
                    : "student_mobile_number"
                }`
              ]
            : `– –`}
        </span>
      </Box>
      <OutboundCallDialog
        openDialog={openCallDialog}
        setOpenDialog={setOpenCallDialog}
        applicationId={
          typeof dataRow?.application_id === "string"
            ? dataRow?.application_id
            : ""
        }
        phoneNumber={
          dataRow[
            `${
              dataRow.student_mobile_no
                ? "student_mobile_no"
                : "student_mobile_number"
            }`
          ]
        }
      />
    </Box>
  );
}

export default StudentContact;
