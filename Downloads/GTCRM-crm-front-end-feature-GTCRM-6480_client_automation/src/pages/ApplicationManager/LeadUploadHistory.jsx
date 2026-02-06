import { Box } from "@mui/material";
import React from "react";
import RawDataUploadHistory from "../Query_Manager/RawDataUploadHistory";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import { useState } from "react";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import {
  useDeleteLeadUploadHistoryMutation,
  useManualCounsellorAssignMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import LeadAssignToCounsellorDialog from "./LeadAssignToCounsellorDialog";

const LeadUploadHistory = ({ state }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loadingDeleteLead, setLoadingDeleteLead] = useState(false);
  const [leadDeleteInternalServerError, setLeadDeleteInternalServerError] =
    useState(false);
  const [leadDeleteSomethingWentWrong, setLeadDeleteSomethingWentWrong] =
    useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState([]);

  const [openAssignCounsellorDialog, setOpenAssignCounsellorDialog] =
    useState(false);
  const [loadingAssignCounsellor, setLoadingAssignCounsellor] = useState(false);
  const [
    assignCounsellorInternalServerError,
    setAssignCounsellorInternalServerError,
  ] = useState(false);
  const [
    assignCounsellorSomethingWentWrong,
    setAssignCounsellorSomethingWentWrong,
  ] = useState(false);
  const [counsellorId, setCounsellorId] = useState("");

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const pushNotification = useToasterHook();

  const [deleteLeadUploadHistory] = useDeleteLeadUploadHistoryMutation();
  const [manualCounsellorAssign] = useManualCounsellorAssignMutation();
  const handleDeleteUploadedLead = () => {
    // delete api need to call here
    setLoadingDeleteLead(true);
    deleteLeadUploadHistory({
      collegeId,
      payload: selectedHistoryId,
    })
      .unwrap()
      .then((data) => {
        try {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            pushNotification("success", data?.message);
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setLeadDeleteSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else if (error?.status === 500) {
          handleInternalServerError(setLeadDeleteInternalServerError, "", 5000);
        }
      })
      .finally(() => {
        setLoadingDeleteLead(false);
        setOpenDeleteModal(false);
      });
  };

  const handleAssignToCounsellor = (event) => {
    event.preventDefault();
    setLoadingAssignCounsellor(true);
    manualCounsellorAssign({
      collegeId,
      payload: {
        offline_data_ids: selectedHistoryId,
        counselor_id: counsellorId,
      },
    })
      .unwrap()
      .then((data) => {
        try {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            pushNotification("success", data?.message);
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setAssignCounsellorSomethingWentWrong,
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
        } else if (error?.status === 500) {
          handleInternalServerError(
            setAssignCounsellorInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => {
        setLoadingAssignCounsellor(false);
        setOpenAssignCounsellorDialog(false);
      });
  };

  return (
    <Box>
      <RawDataUploadHistory
        state={state}
        setOpenDeleteModal={setOpenDeleteModal}
        setOpenAssignCounsellorDialog={setOpenAssignCounsellorDialog}
        setSelectedHistoryId={setSelectedHistoryId}
      ></RawDataUploadHistory>
      {openDeleteModal && (
        <DeleteDialogue
          openDeleteModal={openDeleteModal}
          handleCloseDeleteModal={() => setOpenDeleteModal(false)}
          handleDeleteSingleTemplate={handleDeleteUploadedLead}
          internalServerError={leadDeleteInternalServerError}
          somethingWentWrong={leadDeleteSomethingWentWrong}
          apiResponseChangeMessage={apiResponseChangeMessage}
          loading={loadingDeleteLead}
        />
      )}
      <LeadAssignToCounsellorDialog
        internalServerError={assignCounsellorInternalServerError}
        somethingWentWrong={assignCounsellorSomethingWentWrong}
        loadingAssignCounsellor={loadingAssignCounsellor}
        handleCloseDialogs={() => setOpenAssignCounsellorDialog(false)}
        openDialog={openAssignCounsellorDialog}
        handleAssignToCounsellor={handleAssignToCounsellor}
        setSelectedCounsellorId={setCounsellorId}
      />
    </Box>
  );
};

export default LeadUploadHistory;
