import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "../../styles/ApplicationManagerTable.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useDeleteSelectionProcedureMutation } from "../../Redux/Slices/selectionProcedureSlice";
import { tableSlice } from "../../Redux/Slices/applicationDataApiSlice";
import { filterOptionData } from "../../Redux/Slices/filterDataSlice";
import { useDispatch } from "react-redux";
import DeleteDialogue from "../shared/Dialogs/DeleteDialogue";

const SelectionProcedureAction = ({
  isScrolledToPagination,
  selectedSelectionProcedure,
  setSelectedSelectionProcedure,
  setInternalServerError,
  setSomethingWentWrong,
}) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const [loadingDeleteApi, setLoadingDeleteApi] = useState(false);
  const [deleteSelectionProcedure] = useDeleteSelectionProcedureMutation();

  function handleDeleteSelectionProcedure() {
    setLoadingDeleteApi(true);
    deleteSelectionProcedure({
      collegeId,
      selectedSelectionProcedure,
    })
      .unwrap()
      .then((data) => {
        try {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            pushNotification("success", data?.message);
            setSelectedSelectionProcedure([]);
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else if (error?.status === 500) {
          handleInternalServerError(setInternalServerError, "", 5000);
        }
      })
      .finally(() => {
        setLoadingDeleteApi(false);
        dispatch(tableSlice.util.resetApiState());
        dispatch(filterOptionData.util.resetApiState());
      });
  }

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
                {selectedSelectionProcedure?.length} item selected
              </Typography>
            </Box>
            <Box onClick={setOpenDeleteDialog} className="lead-action-content">
              <DeleteOutlineOutlinedIcon /> Delete
            </Box>
          </Box>

          <DeleteDialogue
            handleDeleteSingleTemplate={() => {
              handleDeleteSelectionProcedure();
            }}
            openDeleteModal={openDeleteDialog}
            handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
            loading={loadingDeleteApi}
          />
        </Card>
      </Box>
    </Box>
  );
};
export default SelectionProcedureAction;
