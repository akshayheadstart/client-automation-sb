import { Card, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import React, { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import ChangeStatus from "../../shared/ViewStudentList/ChangeStatus";
import SelectTemplateDialog from "../../../pages/TemplateManager/SelectTemplateDialog";
import SmsAndWhatsapp from "../../userProfile/SmsAndWhatsapp";
import Mail from "../../userProfile/Mail";
import useToasterHook from "../../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import "../../../styles/ApplicationManagerTable.css";
import CustomTooltip from "../../shared/Popover/Tooltip";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const DataSegmentListTableAction = ({
  isScrolledToPagination,
  selectedDataSegmentList,
  setSelectedDataSegmentList,
  setInternalServerError,
  setSomethingWentWrong,
  localStorageKey,
  handleSelectDataSegmentStatus,
  loadingChangeStatus,
  from,
  selectedDataSegmentId,
  setSelectedDataSegmentId,
  sumOfDataSegmentCount,
  setOpenSelectAutomationDrawer,
}) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  // const permissions = useSelector((state) => state.authentication.permissions);
  // const editPermission =
  //   permissions?.menus?.data_segment_manager?.data_segment_manager?.features
  //     ?.edit_data_segment;

  const status = ["Active", "Closed"];
  const ref = useRef();

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    useState(false);
  const [templateId, setTemplateId] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [smsDltContentId, setSmsDltContentId] = useState("");
  const [smsType, setSmsType] = useState("");
  const [smsSenderName, setSmsSenderName] = useState("");

  const [openDialogsSms, setOpenDialogsSms] = useState(false);
  const [openDialogsWhatsapp, setOpenDialogsWhatsapp] = useState(false);

  const handleComposerClose = () => {
    setIsComposeOpen(false);
  };

  const handleClickOpenDialogsSms = () => {
    setOpenDialogsSms(true);
  };

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };
  const handleCloseDialogsSms = () => {
    setOpenDialogsSms(false);
  };

  const handleClickOpenSelectTemplate = (type) => {
    setOpenSelectTemplateDialog(true);
    setTemplateType(type);
  };
  const handleClickOpenDialogsWhatsapp = () => {
    setOpenDialogsWhatsapp(true);
  };
  const handleCloseDialogsWhatsapp = () => {
    setOpenDialogsWhatsapp(false);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  //   download data segment list
  const handleDataSegmentListDownload = () => {
    setIsDownloading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/data_segments/download/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(selectedDataSegmentId))
    )
      .then((res) =>
        res.json().then((result) => {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.message) {
            const expectedData = result?.file_url;
            try {
              if (typeof expectedData === "string") {
                window.open(result?.file_url);
                setSelectedDataSegmentList([]);
                setSelectedDataSegmentId([]);
                localStorage.removeItem(
                  `${Cookies.get("userId")}${localStorageKey}`
                );
              } else {
                throw new Error(
                  "download data segment list API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
            }
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
          }
        })
      )
      .catch(() => {
        handleInternalServerError(setInternalServerError, "", 5000);
      })
      .finally(() => setIsDownloading(false));
  };

  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card
          className={`lead-action-card ${
            isScrolledToPagination ? "move-up" : "move-down"
          }`}
        >
          <Box className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedDataSegmentList?.length} item selected
              </Typography>
            </Box>

            {from !== "create-automation" ? (
              <>
                {/* {editPermission && ( */}
                <>
                  {loadingChangeStatus ? (
                    <CircularProgress size={25} color="info" />
                  ) : (
                    <Box className="lead-action-content">
                      <ChangeStatus
                        reference={ref}
                        handleSelectMenu={handleSelectDataSegmentStatus}
                        statusList={status}
                      />
                    </Box>
                  )}
                </>
                {/* // )} */}

                {/* {editPermission && ( */}
                <Box
                  className="lead-action-content"
                  onClick={() => {
                    const selectedDataType =
                      selectedDataSegmentList?.[0]?.module_name;
                    const filteredDataSegments =
                      selectedDataSegmentList?.filter(
                        (data) => data.module_name === selectedDataType
                      );

                    if (
                      filteredDataSegments?.length ===
                      selectedDataSegmentList?.length
                    ) {
                      setOpenSelectAutomationDrawer(true);
                    } else {
                      pushNotification(
                        "warning",
                        "Please select same data type"
                      );
                    }
                  }}
                >
                  <PrecisionManufacturingIcon /> Select Automation
                </Box>
                {/* )} */}
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        onClick={() => setIsComposeOpen(true)}
                        className="lead-action-content"
                      >
                        <EmailOutlinedIcon /> Email
                      </Box>
                    }
                    color={true}
                    placement={"top"}
                    accountType={
                      import.meta.env.VITE_ACCOUNT_TYPE === "demo"
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Box
                    onClick={() => setIsComposeOpen(true)}
                    className="lead-action-content"
                  >
                    <EmailOutlinedIcon /> Email
                  </Box>
                )}

                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        onClick={() => handleClickOpenSelectTemplate("sms")}
                        className="lead-action-content"
                      >
                        <SmsOutlinedIcon /> SMS
                      </Box>
                    }
                    color={true}
                    placement={"top"}
                    accountType={
                      import.meta.env.VITE_ACCOUNT_TYPE === "demo"
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Box
                    onClick={() => handleClickOpenSelectTemplate("sms")}
                    className="lead-action-content"
                  >
                    <SmsOutlinedIcon /> SMS
                  </Box>
                )}
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        onClick={() => {
                          handleClickOpenSelectTemplate("whatsapp");
                          handleClickOpenDialogsWhatsapp();
                        }}
                        className="lead-action-content"
                      >
                        <WhatsAppIcon /> Whatsapp
                      </Box>
                    }
                    color={true}
                    placement={"top"}
                    accountType={
                      import.meta.env.VITE_ACCOUNT_TYPE === "demo"
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Box
                    onClick={() => {
                      handleClickOpenSelectTemplate("whatsapp");
                      handleClickOpenDialogsWhatsapp();
                    }}
                    className="lead-action-content"
                  >
                    <WhatsAppIcon /> Whatsapp
                  </Box>
                )}

                {isDownloading ? (
                  <CircularProgress size={25} color="info" />
                ) : (
                  <Box
                    onClick={handleDataSegmentListDownload}
                    className="lead-action-content"
                  >
                    <FileDownloadOutlinedIcon /> Download
                  </Box>
                )}
              </>
            ) : (
              <>
                <Box> | </Box>
                <Box> Total Data : {sumOfDataSegmentCount}</Box>
              </>
            )}
          </Box>
        </Card>
      </Box>
      {/* select sms template component  */}
      {openSelectTemplateDialog && (
        <SelectTemplateDialog
          setTemplateId={setTemplateId}
          handleClickOpenDialogsSms={handleClickOpenDialogsSms}
          openDialoge={openSelectTemplateDialog}
          handleClose={handleCloseSelectTemplate}
          setTemplateBody={setTemplateBody}
          setSmsDltContentId={setSmsDltContentId}
          setSmsType={setSmsType}
          setSenderName={setSmsSenderName}
          from={templateType}
        ></SelectTemplateDialog>
      )}

      {/* Send Sms  */}
      <Box>
        <SmsAndWhatsapp
          color="#DD34B8"
          name={"SMS"}
          handleClickOpenDialogs={handleClickOpenDialogsSms}
          handleCloseDialogs={handleCloseDialogsSms}
          openDialogs={openDialogsSms}
          setOpenDialogs={setOpenDialogsSms}
          smsType={smsType}
          smsSenderName={smsSenderName}
          selecteMobileNumber={selectedDataSegmentId}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          smsDltContentId={smsDltContentId}
          from="data-segment"
          setSelectedMobileNumbers={setSelectedDataSegmentId}
          localStorageKey={localStorageKey}
          setSelectedApplications={setSelectedDataSegmentList}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          color="#25D366"
          name={"WhatsApp"}
          templateId={templateId}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          selecteMobileNumber={selectedDataSegmentId}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsapp}
          handleCloseDialogs={handleCloseDialogsWhatsapp}
          openDialogs={openDialogsWhatsapp}
          setOpenDialogs={setOpenDialogsWhatsapp}
          from="data-segment"
          setSelectedMobileNumbers={setSelectedDataSegmentId}
          localStorageKey={localStorageKey}
          setSelectedApplications={setSelectedDataSegmentList}
        ></SmsAndWhatsapp>
      </Box>
      <Mail
        email={selectedDataSegmentList}
        open={isComposeOpen}
        onClose={handleComposerClose}
        hideToInputField={true}
        setSelectedEmails={setSelectedDataSegmentId}
        localStorageKey={localStorageKey}
        from="data-segment"
        selectedEmails={selectedDataSegmentId}
        sendBulkEmail={true}
        setSelectedApplications={setSelectedDataSegmentList}
      ></Mail>
    </Box>
  );
};
export default DataSegmentListTableAction;
