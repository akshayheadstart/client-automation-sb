import React, { useState } from "react";
import RegisteredName from "../application-manager/table-cell/RegisteredName";
import StudentContact from "../application-manager/StudentContact";
import { PaymentStatus } from "../application-manager/PaymentStatus";
import LeadType from "../application-manager/LeadType";
import { Box, Typography } from "@mui/material";
import ApplicationStatus from "../application-manager/ApplicationStatus";

function RenderTableColumn({
  tableHead,
  dataRow,
  applicationIndex,
  handleOpenUserProfileDrawer,
  setUserDetailsStateData,
  dataType,
}) {
  const [isLead] = useState(() => dataType === "Lead");
  if (tableHead === "Name") {
    return (
      <RegisteredName
        dataRow={dataRow}
        lead={isLead || dataType?.toLowerCase() === "raw data"}
        applicationIndex={applicationIndex}
        handleOpenUserProfileDrawer={handleOpenUserProfileDrawer}
        setUserDetailsStateData={setUserDetailsStateData}
      />
    );
  } else if (tableHead === "Form Name") {
    if (isLead) {
      return (
        <>
          {dataRow?.course_name?.map((course, index) => (
            <Box sx={{ m: "3px" }} key={course}>
              {course ? (
                <Typography
                  sx={{
                    color: "#007ECC",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleOpenUserProfileDrawer();
                    setUserDetailsStateData({
                      applicationId: dataRow?.application_id[index],
                      studentId: dataRow?.student_id,
                    });
                  }}
                  variant="body2"
                >
                  {course}
                </Typography>
              ) : (
                `– –`
              )}
            </Box>
          ))}
        </>
      );
    } else {
      return dataRow?.course_name ? dataRow?.course_name : `– –`;
    }
  } else if (tableHead === "Automation") {
    return dataRow?.automation ? dataRow?.automation : `– –`;
  } else if (tableHead === "Contact Details") {
    return (
      <StudentContact
        dataRow={{
          student_email_id: dataRow?.email || dataRow?.student_email_id,
          student_mobile_no:
            dataRow.mobile_number || dataRow?.student_mobile_no,
        }}
      />
    );
  } else if (tableHead === "Payment Status") {
    if (isLead) {
      if (dataRow?.payment_status?.length) {
        return dataRow?.payment_status?.map((status, index) => (
          <PaymentStatus key={index} rowData={{ payment_status: status }} />
        ));
      } else {
        return `– –`;
      }
    } else {
      return <PaymentStatus rowData={dataRow} />;
    }
  } else if (tableHead === "Lead Stage") {
    if (isLead) {
      if (dataRow?.lead_stage?.length) {
        return dataRow?.lead_stage?.map((stage, index) => (
          <Box
            key={index}
            sx={{
              cursor: "default",
              display: "inline-block",
              padding: "5px 15px",
            }}
            className="status lead-stage"
          >
            {stage || `– –`}
          </Box>
        ));
      } else {
        return `– –`;
      }
    } else {
      return (
        <Box
          sx={{
            cursor: "default",
            display: "inline-block",
            padding: "5px 15px",
          }}
          className="status lead-stage"
        >
          {dataRow?.lead_stage || `– –`}
        </Box>
      );
    }
  } else if (tableHead === "Registration Date") {
    if (isLead) {
      if (dataRow?.registration_date?.length) {
        return dataRow.registration_date?.map((date, index) => (
          <Box sx={{ m: 0.4 }} key={index}>
            {date}
          </Box>
        ));
      } else {
        return `– –`;
      }
    } else {
      return dataRow?.registration_date || `– –`;
    }
  } else if (tableHead === "State") {
    return dataRow?.state || `– –`;
  } else if (tableHead === "City") {
    return dataRow?.city || `– –`;
  } else if (tableHead === "Source") {
    return dataRow?.source_name ? dataRow?.source_name : `– –`;
  } else if (tableHead === "Lead Type") {
    return <LeadType rowData={dataRow} />;
  } else if (tableHead === "Counselor Name") {
    return dataRow?.counselor_name ? dataRow?.counselor_name : `– –`;
  } else if (tableHead === "Application Stage") {
    if (isLead) {
      if (dataRow?.application_stage?.length) {
        return dataRow?.application_stage?.map((stage, index) => (
          <ApplicationStatus
            key={index}
            dataRow={{ application_status: stage }}
          />
        ));
      } else {
        return `– –`;
      }
    } else {
      return (
        <ApplicationStatus
          dataRow={{ application_status: dataRow?.application_stage }}
        />
      );
    }
  } else if (tableHead === "UTM Campaign") {
    return dataRow?.utm_campaign ? dataRow?.utm_campaign : `– –`;
  } else if (tableHead === "UTM Medium") {
    return dataRow?.utm_medium ? dataRow?.utm_medium : `– –`;
  } else if (tableHead === "Outbound Calls Count") {
    return dataRow?.outbound_call ? dataRow?.outbound_call : `– –`;
  } else if (tableHead === "Source Type") {
    return dataRow.source_type?.length > 0 ? (
      <Box className="source-type-status status">{dataRow.source_type}</Box>
    ) : (
      `– –`
    );
  } else if (tableHead === "Verification Status") {
    return (
      <Box
        className={`${dataRow?.verification ? "captured" : "failed"} status`}
      >
        {dataRow?.verification ? "Verified" : "Unverified"}
      </Box>
    );
  } else if (tableHead === "Lead Sub Stage") {
    return dataRow.lead_sub_stage?.length ? (
      <Box className="status lead-stage">{dataRow.lead_sub_stage}</Box>
    ) : (
      <Box> `– –`</Box>
    );
  }
}

export default React.memo(RenderTableColumn);
