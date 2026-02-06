import { Box } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../../../../styles/DocumentVerificationStatus.css";

const DocumentVerificationStatus = ({ dataRow, applicationIndex }) => {
  const navigate = useNavigate();
  const { verification } = dataRow || {};

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        className={`${verification?.dv_status
          ?.toLowerCase()
          ?.split(" ")
          .join("-")} dv-status`}
      >
        {verification?.dv_status ? verification?.dv_status : `– –`}
      </Box>
      <ArrowForwardIcon
        data-testid="down-arrow"
        sx={{
          color:
            verification?.dv_status?.toLowerCase() === "verified"
              ? "grey"
              : "#0F52BA",
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/userProfile", {
            state: {
              applicationId: Array.isArray(dataRow?.application_id)
                ? dataRow?.application_id?.[0]
                : dataRow?.application_id,
              studentId: dataRow?.student_id,
              courseName: Array.isArray(dataRow?.course_name)
                ? dataRow?.course_name?.[0]
                : dataRow?.course_name,
              eventType: "dv-status",
            },
          });
          localStorage.setItem(
            `${Cookies.get("userId")}applicationIndex`,
            JSON.stringify(applicationIndex)
          );
        }}
      />
    </Box>
  );
};

export default DocumentVerificationStatus;
