import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "../../styles/leadDetails.css";
import { Button, Drawer } from "@mui/material";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { useState } from "react";
import "../../styles/sharedStyles.css";
import "../../styles/Script.css";
import DeleteDialogue from "../shared/Dialogs/DeleteDialogue";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import {
  useGetAllScriptDataQuery,
  useUpdateFollowupStatusMutation
} from "../../Redux/Slices/applicationDataApiSlice";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import AddSecondaryMobileAndEmailDialog from "../AddSecondaryMobileAndEmailDialoag/AddSecondaryMobileAndEmailDialog";
import FilterSelectPicker from "../shared/filters/FilterSelectPicker";
import { organizeScriptFilterOption } from "../../helperFunctions/filterHelperFunction";
import ScriptDetails from "../../pages/ResourceManagement/ScriptDetails";
import OutboundCallDialog from "../shared/Dialogs/OutboundCallDialog";
import MultipleTabs from "../shared/tab-panel/MultipleTabs";
import LeadOfflinePayment from "./OfflinePayment/LeadOfflinePayment";
import LeadDetailsInRow from "./LeadDetailsInRow";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function LeadDetails({
  userProfileLeadsDetails,
  leadDetailsInternalServerError,
  hideLeadDetails,
  somethingWentWrongInLeadDetails,
  applicationId,
  studentId,
  setCallApiAgainLeadDetails,
  leadProfileAction,
}) {
  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
    const systemPreference = useSelector(
      (state) => state.authentication.currentUserInitialCollege?.system_preference
    );
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [leadDetailsData, setLeadDetailsData] = useState([]);
 
  React.useEffect(() => {
    let updatedLeadDetailsData = [
      {
        label: "Program Name",
        value: userProfileLeadsDetails?.lead_details?.course_name,
        subDetails: [
          {
            label: "2nd Program",
            value: userProfileLeadsDetails?.lead_details?.second_program,
          },
        ],
      },
      {
        label: "Primary Email ID",
        value: userProfileLeadsDetails?.lead_details?.email,
        hasHoverAction: true,
        subDetails: [
          {
            label: "Secondary Email ID",
            value: userProfileLeadsDetails?.lead_details?.secondary_email,
          },
        ],
      },
      {
        label: "Primary Phone Number",
        value: userProfileLeadsDetails?.lead_details?.mobile,
        hasHoverAction: true,
        onClick: () => setOpenCallDialog(true),
        subDetails: [
          {
            label: "Secondary Phone Number",
            value: userProfileLeadsDetails?.lead_details?.secondary_mobile,
          },
        ],
      },
      {
        label: "Upcoming follow-up:",
        hasHoverAction: true,
        value: userProfileLeadsDetails?.lead_details?.upcoming_followup,
      },
      {
        label: "last Active:",
        value: userProfileLeadsDetails?.lead_details?.last_active
          ? userProfileLeadsDetails?.lead_details?.last_active
          : "N/A",
      },
      {
        label: "Lead added on",
        value: userProfileLeadsDetails?.lead_details?.lead_added
          ? userProfileLeadsDetails?.lead_details?.lead_added
          : "N/A",
      },
      {
        label: "Automation Details",
        value: userProfileLeadsDetails?.lead_details?.automation_count
          ? userProfileLeadsDetails?.lead_details?.automation_count
          : "N/A",
      },
      {
        label: "Gender:",
        value: userProfileLeadsDetails?.lead_details?.gender
          ? userProfileLeadsDetails?.lead_details?.gender
          : "N/A",
      },
      {
        label: "State:",
        value: userProfileLeadsDetails?.lead_details?.state
          ? userProfileLeadsDetails?.lead_details?.state
          : "N/A",
      },
      {
        label: "City:",
        value: userProfileLeadsDetails?.lead_details?.city
          ? userProfileLeadsDetails?.lead_details?.city
          : "N/A",
      },
      {
        label: "Programme Level:",
        value: userProfileLeadsDetails?.lead_details?.programing_level
          ? userProfileLeadsDetails?.lead_details?.programing_level
          : "N/A",
      },
      {
        label: "12th Details",
        subDetails: [
          {
            label: "12th School Name:",
            value:
              userProfileLeadsDetails?.additioan_details?.["12th_school_name"],
          },
          {
            label: "12th Percentage:",
            value:
              userProfileLeadsDetails?.additioan_details?.["12th_percentage"],
          },
          {
            label: "12th Subject:",
            value: userProfileLeadsDetails?.additioan_details?.["12th_subject"],
          },
        ],
      },
      {
        label: "UG Details",
        subDetails: [
          {
            label: "Graduation Courses:",
            value: userProfileLeadsDetails?.additioan_details?.graduation_subject
              ? userProfileLeadsDetails?.additioan_details?.graduation_subject
              : "N/A",
          },
          {
            label: "Graduation Year:",
            value: userProfileLeadsDetails?.additioan_details?.graduation_year
              ? userProfileLeadsDetails?.additioan_details?.graduation_year
              : "N/A",
          },
        ],
      },
      {
        label: "Entitled scholarship",
        value: `${userProfileLeadsDetails?.lead_details?.entitled_scholarship}% (<Course Amount after scholarship>)`,
      },
      {
        label: "Lead Score",
        value: userProfileLeadsDetails?.lead_details?.lead_score,
      },
    ];

    if (systemPreference && systemPreference?.prefernece || systemPreference &&systemPreference?.preference) {
      updatedLeadDetailsData.shift();
      const preferenceData = userProfileLeadsDetails?.lead_details?.preference_info?.slice(1)?.map((item,index) => ({
        label: `Preference ${index +2}`,
        value: item,
      }));
      updatedLeadDetailsData.unshift({
        label: "Preference 1",
        value: userProfileLeadsDetails?.lead_details?.course_name?.length>0?userProfileLeadsDetails?.lead_details?.course_name:"N/A",
        subDetails: preferenceData?.length>0?preferenceData:[],
      });
    }

    setLeadDetailsData(updatedLeadDetailsData);
  }, [userProfileLeadsDetails, systemPreference?.preference]);

  const [followupCheckedStatus, setFollowupCheckedStatus] = useState(null);
  const [followupStatusUpdateLoading, setFollowupStatusUpdateLoading] =
    useState(false);
  const [
    openFollowupStatusUpdateConfirmationModal,
    setOpenFollowupStatusUpdateConfirmationModal,
  ] = useState(false);

  const [followupIndex, setFollowupIndex] = useState(null);
  const [
    followupStatusUpdateInternalServerError,
    setFollowupStatusUpdateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInFollowupStatusUpdate,
    setSomethingWentWrongInFollowupStatusUpdate,
  ] = useState(false);

  const [scriptList, setScriptList] = React.useState([]);
  const [scriptListOptions, setScriptListOptions] = React.useState([]);
  const [selectedScript, setSelectedScript] = React.useState(null);
  const [hideScriptList, setHideScriptList] = React.useState(false);
  const [scriptDetailsOpen, setScriptDetailsOpen] = React.useState(false);
  const [scriptDetailsData, setScriptDetailsData] = React.useState(null);

  const showScriptDetails = (id) => {
    setSelectedScript(id);
    if (id !== null) {
      setScriptDetailsData(scriptList?.find((item) => item?._id === id));
      setScriptDetailsOpen(true);
    } else {
      setScriptDetailsData(null);
      setScriptDetailsOpen(false);
    }
  };

  const handleScriptDetailsDialogClose = () => {
    setScriptDetailsOpen(false);
    setSelectedScript(null);
  };

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const [handleUpdateFollowupStatus] = useUpdateFollowupStatusMutation();
  const [getAllScriptInternalServerError,setGetAllScriptInternalServerError]=useState(false)
  const [somethingWentWrongInGetScript,setSomethingWentWrongInGetScript]=useState(false)
  const [scriptAPICall, setScriptAPICall] = useState(false)
  const { scriptPayload} =
  useContext(LayoutSettingContext);
  const scriptDataPayload={
    program_name: userProfileLeadsDetails?.lead_details?.program_list?.length>0?[userProfileLeadsDetails?.lead_details?.program_list[0]]:[],
  tags: scriptPayload?.tags?.length>0?scriptPayload?.tags:[],
  application_stage:scriptPayload?.application_stage?.length>0?scriptPayload?.application_stage?.toLowerCase(): "",
  lead_stage: scriptPayload?.lead_stage?.length>0?scriptPayload?.lead_stage:"",
  source: scriptPayload?.source?.length>0?[scriptPayload?.source]:"",
  }

  const { data, isSuccess, isFetching, error, isError } =
  useGetAllScriptDataQuery({
        collegeId,
        all: true,
        payload: scriptDataPayload,
  },{skip:scriptAPICall? false:true}
  );
React.useEffect(() => {
  try {
    if (isSuccess) {
      if (data?.message) {
        setScriptList(data?.data || []);
       setScriptListOptions(organizeScriptFilterOption(data?.data || []));
      } else {
        throw new Error("get script API response has changed");
      }
    }
    if (isError) {
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
      if (error?.status === 500) {
        handleInternalServerError(setGetAllScriptInternalServerError, setHideScriptList,10000);
      }
    }
  } catch (error) {
    setApiResponseChangeMessage(error);
    handleSomethingWentWrong(setSomethingWentWrongInGetScript, setHideScriptList,10000);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  data?.data,
  error?.data?.detail,
  isError,
  isSuccess,
]);
 
  const handleCompleteAndIncompleteFollowup = () => {
    setFollowupStatusUpdateLoading(true);
    handleUpdateFollowupStatus({
      checkedValue: followupCheckedStatus,
      applicationId,
      indexNumber: followupIndex,
      collegeId,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
              setCallApiAgainLeadDetails((prev) => !prev);
              setOpenFollowupStatusUpdateConfirmationModal(false);
            } else {
              throw new Error("Followup status update api response is changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInFollowupStatusUpdate,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setFollowupStatusUpdateInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setFollowupStatusUpdateLoading(false);
      });
  };
  const [addSecondaryMobileAndEmailOpen, setAddSecondaryMobileAndEmailOpen] =
    React.useState(false);
  const handleAddSecondaryMobileAndEmailClickOpen = () => {
    setAddSecondaryMobileAndEmailOpen(true);
  };

  const handleAddSecondaryMobileAndEmailClose = () => {
    setAddSecondaryMobileAndEmailOpen(false);
  };
  const [toggleDialogContent, setToggleDialogContent] = useState(false);
  const [tabValue, setTabValue] = React.useState(0);
const primaryProgramName=userProfileLeadsDetails?.lead_details?.program_list?.length>0?{course_name:userProfileLeadsDetails?.lead_details?.program_list[0]?.course_name,
  spec_name: userProfileLeadsDetails?.lead_details?.program_list[0]?.course_specialization,
  course_id:userProfileLeadsDetails?.lead_details?.program_list[0]?.course_id
}:{}
  return (
    <>
      {leadDetailsInternalServerError || somethingWentWrongInLeadDetails ||somethingWentWrongInGetScript || getAllScriptInternalServerError ? (
        <Box>
          {(leadDetailsInternalServerError ||getAllScriptInternalServerError )&& (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {(somethingWentWrongInLeadDetails || somethingWentWrongInGetScript) && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{ width: "100%", display: hideLeadDetails ? "block" : "block" }}
        >
          <Box className="lead-details-table-design-box">
            <MultipleTabs
              tabArray={[{ tabName: "General" }, { tabName: "Payment" }]}
              setMapTabValue={setTabValue}
              mapTabValue={tabValue}
              boxWidth="150px !important"
            ></MultipleTabs>
            <Box className="lead-details-button-filter-container">
              {hideScriptList || (
                <FilterSelectPicker
                  setSelectedPicker={showScriptDetails}
                  pickerData={scriptListOptions}
                  placeholder="Script list"
                  pickerValue={selectedScript}
                  placement={"bottomEnd"}
                  className="script-list-dropdown key-select-picker"
                  onOpen={()=>setScriptAPICall(true)}
                  loading={isFetching}
                />
              )}
              <Button
                sx={{ borderRadius: 50, whiteSpace: "nowrap" }}
                variant="contained"
                size="medium"
                color="info"
                className="lead-details-button-design"
              >
                Merge Leads
              </Button>
            </Box>
          </Box>
          {tabValue === 0 && (
            <Box className="lead-details-table-box">
              <TableContainer
                sx={{ boxShadow: 0, height: "430px" }}
                component={Paper}
                className="custom-scrollbar vertical-scrollbar"
              >
                <Table
                  sx={{ minWidth: 200, overflowX: "scroll" }}
                  aria-label="customized table"
                >
                  <TableHead></TableHead>
                  <TableBody>
                    {leadDetailsData?.map((details) => {
                      return (
                        <LeadDetailsInRow
                          key={details?.email}
                          details={details}
                          leadProfileAction={leadProfileAction}
                          handleAddSecondaryMobileAndEmailClickOpen={
                            handleAddSecondaryMobileAndEmailClickOpen
                          }
                          setToggleDialogContent={setToggleDialogContent}
                          userProfileLeadsDetails={userProfileLeadsDetails}
                          setFollowupIndex={setFollowupIndex}
                          setOpenFollowupStatusUpdateConfirmationModal={
                            setOpenFollowupStatusUpdateConfirmationModal
                          }
                          setFollowupCheckedStatus={setFollowupCheckedStatus}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <DeleteDialogue
                openDeleteModal={openFollowupStatusUpdateConfirmationModal}
                handleCloseDeleteModal={() =>
                  setOpenFollowupStatusUpdateConfirmationModal(false)
                }
                handleDeleteSingleTemplate={handleCompleteAndIncompleteFollowup}
                internalServerError={followupStatusUpdateInternalServerError}
                somethingWentWrong={somethingWentWrongInFollowupStatusUpdate}
                apiResponseChangeMessage={apiResponseChangeMessage}
                loading={followupStatusUpdateLoading}
                title="Do you want to update the status?"
              />
              {addSecondaryMobileAndEmailOpen && (
                <AddSecondaryMobileAndEmailDialog
                  addSecondaryMobileAndEmailOpen={
                    addSecondaryMobileAndEmailOpen
                  }
                  handleAddSecondaryMobileAndEmailClose={
                    handleAddSecondaryMobileAndEmailClose
                  }
                  toggleDialogContent={toggleDialogContent}
                  studentId={studentId}
                  userProfileLeadsDetails={
                    userProfileLeadsDetails?.lead_details
                  }
                  setCallApiAgainLeadDetails={setCallApiAgainLeadDetails}
                ></AddSecondaryMobileAndEmailDialog>
              )}
            </Box>
          )}
          {tabValue === 1 && <LeadOfflinePayment
          programName={userProfileLeadsDetails?.lead_details?.program_list?.length>0?[primaryProgramName]:[]}
          applicationId={userProfileLeadsDetails?.lead_details?.application_id}
          tabValue={tabValue}
          studentId={studentId}
          />}
          <Drawer
            anchor={"right"}
            open={scriptDetailsOpen}
            onClose={handleScriptDetailsDialogClose}
            sx={{ width: "50%" }}
          >
            <ScriptDetails
              onClose={handleScriptDetailsDialogClose}
              data={scriptDetailsData}
            />
          </Drawer>
        </Box>
      )}
      <OutboundCallDialog
        openDialog={openCallDialog}
        setOpenDialog={setOpenCallDialog}
        phoneNumber={userProfileLeadsDetails?.lead_details?.mobile}
        applicationId={userProfileLeadsDetails?.lead_details?.application_id}
      />
    </>
  );
}
