/* eslint-disable react-hooks/exhaustive-deps */
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Button, Card, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ReportCreateDrawer from "../../components/ui/Report/ReportCreateDrawer";
import ReportTemplates from "../../components/ui/Report/ReportTemplates";
import regenerateIcon from "../../images/regenerateIcon.svg";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/MODDesignPage.css";
import "../../styles/report.css";
import AutoScheduleReportTable from "./AutoScheduleReportTable";
import PreviousGeneratedReport from "./PreviousGeneratedReport";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useDownloadPreviousReportsMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";

function ReportsAnalytics() {
  const [reportTemplateId, setReportTemplateId] = useState("");
  const [
    isReportDownloadInternalServerError,
    setIsReportDownloadInternalServerError,
  ] = useState(false);
  const [
    isReportDownloadSomethingWentWrong,
    setIsReportDownloadSomethingWentWrong,
  ] = useState(false);
  const [downloadApiLoading, setDownloadApiLoading] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [reportTemplateCount, setReportTemplateCount] = useState(0);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const [openGenerateReportDrawer, setOpenGenerateReportDrawer] =
    useState(false);
  const [generateReportDrawerTitle, setGenerateReportDrawerTitle] =
    useState("");
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Report Analytics Head Title add
  useEffect(() => {
    setHeadTitle("Report Analytics");
    document.title = "Report Analytics";
  }, [headTitle]);
  const [selectedReportList, setSelectedReportList] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedSingleData, setSelectedSingleData] = useState({});
  const [viewButton, setViewButton] = useState(false);
  const [selectedDataIds, setSelectedDataIds] = useState([]);
  const [readOnlyToggle, setReadOnlyToggle] = useState(false);
  const [previewDataToggle, setPreviewDataToggle] = useState(false);
  useEffect(() => {
    if (selectedData.length === 1) {
      setSelectedSingleData(selectedData[0]);
      setPreviewDataToggle(false);
    } else {
      setSelectedSingleData({});
      setPreviewDataToggle(false);
    }
  }, [selectedData, previewDataToggle]);
  const [downloadPreviousReports] = useDownloadPreviousReportsMutation();
  const handleDownloadReports = () => {
    setDownloadApiLoading(true);
    downloadPreviousReports({ collegeId, payload: selectedDataIds })
      .unwrap()
      .then((response) => {
        try {
          if (response?.file_url) {
            window.open(response?.file_url);
            setOpenDownloadModal(false);
            setSelectedReportList([]);
          } else if (response?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (response?.detail) {
            pushNotification("error", response?.detail);
          } else {
            throw new Error("Report download Api response has been changed");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setIsReportDownloadSomethingWentWrong,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(
            setIsReportDownloadInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setDownloadApiLoading(false);
        setSelectedDataIds([]);
      });
  };

  return (
    <Box sx={{ mx: 3 }} className="report-header-box-container">
      <ReportTemplates
        setOpenDrawer={setOpenGenerateReportDrawer}
        setTitle={setGenerateReportDrawerTitle}
        setSelectedSingleData={setSelectedSingleData}
        setReportTemplateId={setReportTemplateId}
        setReportTemplateCount={setReportTemplateCount}
        setReadOnlyToggle={setReadOnlyToggle}
      />
      <Box>
        <Box sx={{ my: 3 }}>
          <Card
            className="report-table-card-container"
            sx={{ position: "relative" }}
          >
            {selectedData?.length > 0 && (
              <Box className="reports-action-wrapper">
                <Card className="reports-action-card">
                  <Box className="MOD-action-content-container">
                    <Box className="MOD-action-content">
                      <Typography variant="subtitle1">
                        {" "}
                        {selectedData?.length} items selected
                      </Typography>
                    </Box>
                    <Box className="MOD-action-content">
                      <Button
                        onClick={setOpenDownloadModal}
                        className="action-button-box"
                        variant="text"
                        startIcon={
                          <FileDownloadOutlinedIcon
                            color="info"
                            sx={{ fontSize: "18px" }}
                          />
                        }
                      >
                        Download
                      </Button>
                    </Box>
                    <Box className="MOD-action-content">
                      <Button
                        className="action-button-box"
                        variant="text"
                        startIcon={
                          <RemoveRedEyeIcon
                            color="info"
                            sx={{
                              fontSize: "18px",
                              color:
                                selectedData?.length >= 2 &&
                                "rgba(126, 146, 162, 0.60)",
                            }}
                          />
                        }
                        disabled={selectedData?.length > 1}
                        onClick={() => {
                          setOpenGenerateReportDrawer(true);
                          setGenerateReportDrawerTitle("Preview Report");
                          setViewButton(false);
                          setReadOnlyToggle(true);
                          setPreviewDataToggle(true);
                        }}
                      >
                        Preview
                      </Button>
                    </Box>
                    <Box className="MOD-action-content">
                      <Button
                        className="action-button-box "
                        variant="text"
                        startIcon={
                          <img
                            src={regenerateIcon}
                            alt="regenerateIcon"
                            style={{ opacity: selectedData?.length > 1 && 0.2 }}
                          />
                        }
                        disabled={selectedData?.length > 1}
                        onClick={() => {
                          setOpenGenerateReportDrawer(true);
                          setGenerateReportDrawerTitle("Regenerate Report");
                          setViewButton(false);
                          setReadOnlyToggle(true);
                          setPreviewDataToggle(true);
                        }}
                      >
                        Regenerate
                      </Button>
                    </Box>
                    <Box className="MOD-action-content">
                      <Button
                        className="action-button-box"
                        variant="text"
                        startIcon={
                          <AddOutlinedIcon
                            color="info"
                            sx={{
                              fontSize: "18px",
                              color:
                                (selectedData?.length >= 2 ||
                                  reportTemplateCount === 12) &&
                                "rgba(126, 146, 162, 0.60)",
                            }}
                          />
                        }
                        disabled={
                          selectedData?.length >= 2 ||
                          reportTemplateCount === 12
                        }
                        onClick={() => {
                          setOpenGenerateReportDrawer(true);
                          setGenerateReportDrawerTitle("Report Template");
                          setViewButton(true);
                          setReadOnlyToggle(true);
                          setPreviewDataToggle(true);
                        }}
                      >
                        Report Template
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Box>
            )}
            <PreviousGeneratedReport
              setSelectedData={setSelectedData}
              setSelectedDataIds={setSelectedDataIds}
              setTitleText={setGenerateReportDrawerTitle}
              setOpenGenerateReportDrawerIn={setOpenGenerateReportDrawer}
              openGenerateReportDrawerIn={openGenerateReportDrawer}
              setSelectedSingleData={setSelectedSingleData}
              reportTemplateCount={reportTemplateCount}
              setReportId={setReportTemplateId}
              setViewButton={setViewButton}
              setSelectedReportList={setSelectedReportList}
              selectedReportList={selectedReportList}
            />
          </Card>
        </Box>
        <Box sx={{ my: 3 }}>
          <Card className="report-table-card-container">
            <AutoScheduleReportTable />
          </Card>
        </Box>

        {Object.keys(selectedSingleData)?.length ? (
          <ReportCreateDrawer
            openDrawer={openGenerateReportDrawer}
            setOpenDrawer={setOpenGenerateReportDrawer}
            title={generateReportDrawerTitle}
            selectedSingleData={selectedSingleData}
            viewButton={viewButton}
            reportId={reportTemplateId}
            reportTemplateCount={reportTemplateCount}
            setReportId={setReportTemplateId}
            readOnlyToggle={readOnlyToggle}
            setSelectedData={setSelectedData}
            setViewButton={setViewButton}
          />
        ) : (
          ""
        )}
      </Box>
      <DeleteDialogue
        openDeleteModal={openDownloadModal}
        handleCloseDeleteModal={() => setOpenDownloadModal(false)}
        handleDeleteSingleTemplate={handleDownloadReports}
        internalServerError={isReportDownloadInternalServerError}
        somethingWentWrong={isReportDownloadSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
        loading={downloadApiLoading}
        title="Are you sure you want to download?"
      />
    </Box>
  );
}

export default ReportsAnalytics;
