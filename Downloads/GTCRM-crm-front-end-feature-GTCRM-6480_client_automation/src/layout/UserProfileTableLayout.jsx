import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "../styles/userprofileTablelayout.css";
import LeadDetails from "../components/userProfile/LeadDetails";
import TimeLineTab from "../components/userProfile/TimeLineTab";
import FollowUpAndNotes from "../components/userProfile/FollowUpAndNotes";
import CommunicationLog from "../components/userProfile/CommunicationLog";
import DocumentLocker from "../components/userProfile/DocumentLocker";
import TicketManager from "../components/userProfile/TicketManager";
import CallLogs from "../components/userProfile/CallLogs";
import { Card } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`horizontal-tabpanel-${index}`}
      aria-labelledby={`horizontal-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `horizontal-tab-${index}`,
    "aria-controls": `horizontal-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {


  const handleChange = (event, newValue) => {
    props?.setValue(newValue);
  };

  // useEffect(() => {
  //   if (props?.eventType === "Student Created Query") {
  //     setValue(5);
  //   } else if (props?.eventType === "Followup Scheduled") {
  //     setValue(1);
  //   } else if (props?.eventType === "Manual Assignment of Lead") {
  //     setValue(1);
  //   } else if (props?.eventType === "dv-status") {
  //     setValue(4);
  //   }
  // }, [props?.eventType]);

  return (
    <Card
      sx={{
        bgcolor: "#FFF",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 10px 60px 0px rgba(226, 236, 249, 0.50)",
      }}
    >
      <Box className="user-profile-tabs-box">
        <Tabs
          orientation={"horizontal"}
          variant={"scrollable"}
          value={props?.value}
          onChange={handleChange}
          aria-label="Horizontal tabs example"
          sx={{
            // width: "270px",
            "& .MuiTabs-indicator": {
              fontSize: 12,
              fontWeight: "normal",
              top: -6,
              backgroundColor: "unset",
              display: "none",
            },
          }}
        >
          <Tab
            className={`user-profile-table-layout-tab ${props?.value === 0
                ? "user-profile-table-layout-tab-active"
                : "user-profile-table-layout-tab-box-shadow"
              }`}
            label="Details"
            {...a11yProps(0)}
          />
          <Tab
            className={`user-profile-table-layout-tab ${props?.value === 1
                ? "user-profile-table-layout-tab-active"
                : "user-profile-table-layout-tab-box-shadow"
              }`}
            label="Followup And Notes"
            {...a11yProps(1)}
          />
          <Tab
            className={`user-profile-table-layout-tab ${props?.value === 2
                ? "user-profile-table-layout-tab-active"
                : "user-profile-table-layout-tab-box-shadow"
              }`}
            label="Timeline"
            {...a11yProps(2)}
          />
          <Tab
            className={`user-profile-table-layout-tab ${props?.value === 3
                ? "user-profile-table-layout-tab-active"
                : "user-profile-table-layout-tab-box-shadow"
              }`}
            label="Communications Logs"
            {...a11yProps(3)}
          />

          <Tab
            className={`user-profile-table-layout-tab ${props?.value === 4
                ? "user-profile-table-layout-tab-active"
                : "user-profile-table-layout-tab-box-shadow"
              }`}
            label="Document"
            {...a11yProps(4)}
          />

          <Tab
            className={`user-profile-table-layout-tab ${props?.value === 5
                ? "user-profile-table-layout-tab-active"
                : "user-profile-table-layout-tab-box-shadow"
              }`}
            label="Query"
            {...a11yProps(5)}
          />

        </Tabs>
      </Box>
      {/* lead details section  */}
      <TabPanel value={props?.value} index={0}>
        <LeadDetails
          userProfileLeadsDetails={props?.userProfileLeadsDetails}
          leadDetailsInternalServerError={props?.leadDetailsInternalServerError}
          hideLeadDetails={props?.hideLeadDetails}
          somethingWentWrongInLeadDetails={
            props?.somethingWentWrongInLeadDetails
          }
          applicationId={props?.applicationId}
          studentId={props?.studentId}
          setCallApiAgainLeadDetails={props?.setCallApiAgainLeadDetails}
          leadProfileAction={props?.leadProfileAction}
        ></LeadDetails>
      </TabPanel>
      <TabPanel value={props?.value} index={1}>
        <FollowUpAndNotes
          applicationId={props?.applicationId}
          followUpData={props?.followUpData}
          handleChangeApplicationLead={props?.handleChangeApplicationLead}
          followupAndNotesInternalServerError={
            props?.followupAndNotesInternalServerError
          }
          hideFollowupAndNotes={props?.hideFollowupAndNotes}
          somethingWentWrongInFollowupAndNotes={
            props?.somethingWentWrongInFollowupAndNotes
          }
          leadProfileAction={props?.leadProfileAction}
        ></FollowUpAndNotes>
      </TabPanel>
      <TabPanel value={props?.value} index={2}>
        <TimeLineTab
          timeLineData={props?.timeLineData}
          handleChangeApplicationLead={props?.handleChangeApplicationLead}
          timelineInternalServerError={props?.timelineInternalServerError}
          hideTimeline={props?.hideTimeline}
          somethingWentWrongInTimeline={props?.somethingWentWrongInTimeline}
          filterAction={props?.filterAction}
          setFilterAction={props?.setFilterAction}
          timelineDateRange={props?.timelineDateRange}
          setTimelineDateRange={props?.setTimelineDateRange}
          setUserProfileTimelineData={props?.setUserProfileTimelineData}
          isFetchingTimeLine={props?.isFetchingTimeLine}
        ></TimeLineTab>
      </TabPanel>

      <TabPanel value={props?.value} index={3}>
        <CommunicationLog
          communicationData={props?.communicationData}
          communicationsLogsInternalServerError={
            props?.communicationsLogsInternalServerError
          }
          hideCommunicationsLogs={props?.hideCommunicationsLogs}
          somethingWentWrongInCommunicationLogs={
            props?.somethingWentWrongInCommunicationLogs
          }
          communicationTabValue={props?.communicationTabValue}
          setCommunicationTabValue={props?.setCommunicationTabValue}
          loadingCommunicationsLogs={props?.loadingCommunicationsLogs}
          communicationLogsDate={props?.communicationLogsDate}
          setCommunicationLogsDate={props?.setCommunicationLogsDate}
        ></CommunicationLog>
      </TabPanel>
      <TabPanel value={props?.value} index={4}>
        <DocumentLocker
          studentUploadedDocumentData={props?.studentUploadedDocumentData}
          userProfileLeadsDetails={props?.userProfileLeadsDetails}
          documentLockerInternalServerError={
            props?.documentLockerInternalServerError
          }
          hideDocumentLocker={props?.hideDocumentLocker}
          somethingWentWrongInDocuentLocker={
            props?.somethingWentWrongInDocuentLocker
          }
          studentId={props?.studentId}
          applicationId={props?.applicationId}
          setShouldCallStudentDocumentAPI={
            props?.setShouldCallStudentDocumentAPI
          }
          leadProfileAction={props?.leadProfileAction}
          isFetchingLeadDocument={props?.isFetchingLeadDocument}
        ></DocumentLocker>
      </TabPanel>
      <TabPanel value={props?.value} index={5}>
        <TicketManager applicationId={props?.applicationId}
          leadProfileAction={props?.leadProfileAction}></TicketManager>
      </TabPanel>
      <TabPanel value={props?.value} index={6}>
        <CallLogs
          callLogs={props?.callLogs}
          callLogsInternalServerError={props?.callLogsInternalServerError}
          hideCallLogs={props?.hideCallLogs}
          somethingWentWrongInCallLogs={props?.somethingWentWrongInCallLogs}
        ></CallLogs>
      </TabPanel>
    </Card>
  );
}
