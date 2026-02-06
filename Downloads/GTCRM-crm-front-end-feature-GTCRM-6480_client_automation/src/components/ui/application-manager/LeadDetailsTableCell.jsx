import { Box } from "@mui/system";
import ApplicationStatus from "./ApplicationStatus";
import LeadType from "./LeadType";
import StudentContact from "./StudentContact";
import RegisteredName from "./table-cell/RegisteredName";
import { Typography } from "@mui/material";
import DocumentVerificationStatus from "./table-cell/DocumentVerificationStatus";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Cookies from "js-cookie";
import ShowAutomation from "./ShowAutomation";
const LeadDetailsTableCell = ({
  tableHead,
  dataRow,
  applicationIndex,
  handleOpenUserProfileDrawer,
  setSelectStudentApplicationId,
  setUserDetailsStateData,
  setSkipUserProfileApiCall,
  handleClickOpenDialogsLead,
  setClickedStudentId,
  isActionDisable,
}) => {
  if (tableHead === "name") {
    return (
      <RegisteredName
        lead={true}
        dataRow={dataRow}
        handleOpenUserProfileDrawer={handleOpenUserProfileDrawer}
        setSelectStudentApplicationId={setSelectStudentApplicationId}
        setUserDetailsStateData={setUserDetailsStateData}
      />
    );
  } else if (tableHead === "application") {
    return dataRow?.custom_application_id?.length > 0
      ? dataRow?.custom_application_id?.map((id) => (
          <Box sx={{ m: "3px" }} key={id}>
            {id ? <Typography variant="body2">{id}</Typography> : `– –`}
          </Box>
        ))
      : `– –`;
  } else if (tableHead === "form") {
    return dataRow[
      `${dataRow.course_name ? "course_name" : "course_names"}`
    ]?.map((course, index) => (
      <Box
        // onClick={() => {
        //   navigate("/userProfile", {
        //     state: {
        //       applicationId: dataRow.application_id[index],
        //       studentId: dataRow.student_id,
        //       courseName: dataRow.course_name[index],
        //       lead: true,
        //       eventType: "lead-manager",
        //     },
        //   });
        // }}
        sx={{ m: "3px" }}
        key={course}
      >
        {/* <Link to=""> */}
        {course ? (
          <Typography
            sx={{
              color: "#007ECC",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              handleOpenUserProfileDrawer();
              // setSelectStudentApplicationId(dataRow?.application_id[index]);
              // setSkipUserProfileApiCall(false)
              setUserDetailsStateData({
                applicationId: dataRow?.application_id[index],
                studentId: dataRow?.student_id,
                courseName: dataRow?.course_name[index],
                eventType: "lead-manager",
                showArrowIcon: true,
              });
              localStorage.setItem(
                `${Cookies.get("userId")}applicationIndex`,
                JSON.stringify(applicationIndex)
              );
            }}
            variant="body2"
          >
            {course}
          </Typography>
        ) : (
          `– –`
        )}
        {/* </Link> */}
      </Box>
    ));
  } else if (tableHead === "contact") {
    return <StudentContact dataRow={dataRow} />;
  } else if (tableHead === "mobile") {
    return dataRow?.student_mobile_no ? dataRow?.student_mobile_no : `– –`;
  } else if (tableHead === "payment") {
    return dataRow.payment_status?.length > 0
      ? dataRow.payment_status?.map((status, index) => (
          <Box key={index}>
            {status ? (
              <Typography
                className={`${status?.toLowerCase()} status`}
                variant="body2"
              >
                {" "}
                {status}{" "}
              </Typography>
            ) : (
              `– –`
            )}
          </Box>
        ))
      : `– –`;
  } else if (tableHead === "DV Status") {
    return (
      <DocumentVerificationStatus
        dataRow={dataRow}
        applicationIndex={applicationIndex}
      />
    );
  } else if (tableHead === "12th Score") {
    return dataRow?.twelve_marks_name ? dataRow?.twelve_marks_name : `– –`;
  } else if (tableHead === "Registration Date") {
    return dataRow.date?.length > 0
      ? dataRow.date?.map((date) => (
          <Box sx={{ m: "3px" }}>{date ? date : `– –`}</Box>
        ))
      : `– –`;
  } else if (tableHead === "State") {
    return dataRow?.state_name ? dataRow?.state_name : `– –`;
  } else if (tableHead === "automation") {
    return (
      <ShowAutomation
        automationDetails={{
          count: dataRow?.automation,
          names: dataRow?.automation_names,
        }}
      />
    );
  } else if (tableHead === "City") {
    return dataRow?.city_name ? dataRow?.city_name : `– –`;
  } else if (tableHead === "Source") {
    return dataRow?.source_name ? dataRow?.source_name : `– –`;
  } else if (tableHead === "Lead Type") {
    return <LeadType rowData={dataRow} />;
  } else if (tableHead === "stage") {
    return (
      <>
        {dataRow?.lead_stage?.length ? (
          <>
            {dataRow?.lead_stage?.map((stage) => (
              <Box
                onClick={() => {
                  if (!isActionDisable) {
                    setClickedStudentId(dataRow.application_id);
                    handleClickOpenDialogsLead(true);
                  }
                }}
                className="status lead-stage"
              >
                {stage ? stage : `– –`}{" "}
                {!isActionDisable && <ArrowDropDownIcon />}
              </Box>
            ))}
          </>
        ) : (
          `– –`
        )}
      </>
    );
  } else if (tableHead === "Counselor Name") {
    return dataRow?.counselor_name?.map((counselor) => (
      <Box sx={{ m: "3px" }}> {counselor ? counselor : `– –`}</Box>
    ));
  } else if (tableHead === "Application Stage") {
    return dataRow.application_status?.length > 0
      ? dataRow.application_status?.map((application_status) => (
          <Box>
            <ApplicationStatus dataRow={{ application_status }} />
          </Box>
        ))
      : `– –`;
  } else if (tableHead === "UTM Campaign") {
    return dataRow?.utm_campaign ? dataRow?.utm_campaign : `– –`;
  } else if (tableHead === "UTM Medium") {
    return dataRow?.utm_medium ? dataRow?.utm_medium : `– –`;
  } else if (tableHead === "Source Type") {
    return dataRow.source_type?.length > 0
      ? dataRow.source_type?.map((type) => (
          <Box className="source-type-status status">{type}</Box>
        ))
      : `– –`;
  } else if (tableHead === "Verification Status") {
    return (
      <Box
        className={`${
          dataRow?.is_verify === "verified" ? "captured" : "failed"
        } status`}
      >
        {dataRow?.is_verify || `– –`}
      </Box>
    );
  } else if (tableHead === "Lead Sub Stage") {
    return dataRow.lead_sub_stage?.map((stage) => (
      <>
        {stage ? (
          <Box className="status lead-stage">{stage}</Box>
        ) : (
          <Box> `– –`</Box>
        )}
      </>
    ));
  }
};

export default LeadDetailsTableCell;
