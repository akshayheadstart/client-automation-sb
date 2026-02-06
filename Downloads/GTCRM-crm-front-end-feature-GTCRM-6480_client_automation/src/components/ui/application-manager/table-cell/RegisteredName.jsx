import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import DeleteDialogue from "../../../shared/Dialogs/DeleteDialogue";
import { useDeleteTagMutation } from "../../../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import ShowTag from "./ShowTag";
import Cookies from "js-cookie";

const RegisteredName = ({
  dataRow,
  applicationIndex,
  from,
  lead,
  localStorageKey,
  handleOpenUserProfileDrawer,
  setUserDetailsStateData,
  clickableName,
  showArrowIcon
}) => {
  const [loadingDeleteTag, setLoadingDeleteTag] = useState(false);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [clickedStudentId, setClickedStudentId] = useState("");
  const [clickedTag, setClickedTag] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [deleteTag] = useDeleteTagMutation();
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const handleDeleteTag = () => {
    const payload = {
      student_id: clickedStudentId,
      tag: clickedTag,
    };
    setLoadingDeleteTag(true);
    deleteTag({ collegeId, payload })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
            setOpenDeleteDialog(false);
          } else {
            throw new Error("Delete tag API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        setLoadingDeleteTag(false);
        setClickedTag([]);
        setClickedStudentId([]);
      });
  };

  const handleOnClose = (tag, studentId) => {
    setClickedStudentId(studentId);
    setClickedTag(tag);
    setOpenDeleteDialog(true);
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box>
          <Box sx={{ mt: -2, mb: 1 }}>
            {dataRow?.tags?.map((tag, index) => (
              <ShowTag
                tag={tag}
                studentId={dataRow.student_id}
                handleOnClose={handleOnClose}
                index={index}
              />
            ))}
          </Box>
          <Box
            onClick={() => {
              if (!lead) {
                setUserDetailsStateData({
                  applicationId: dataRow?.application_id,
                  studentId: dataRow?.student_id,
                  courseName: dataRow?.course_name,
                  from: from,
                  localStorage: localStorageKey,
                  eventType: "form-manager",
                  showArrowIcon:showArrowIcon
                });
                // navigate("/userProfile", {
                //   state: {
                //     applicationId: dataRow?.application_id,
                //     studentId: dataRow?.student_id,
                //     courseName: dataRow?.course_name,
                //     from: from,
                //     localStorage: localStorageKey,
                //   },
                // });
                localStorage.setItem(
                  `${Cookies.get("userId")}applicationIndex`,
                  JSON.stringify(applicationIndex)
                );
              }
            }}
          >
            {lead ? (
              <Typography color="textPrimary" variant="subtitle2">
                {dataRow?.student_name ? dataRow?.student_name : `– –`}
              </Typography>
            ) : (
              // <Link to="">
              <Typography
                sx={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  if (!clickableName) {
                    handleOpenUserProfileDrawer();
                  }
                }}
                color="textPrimary"
                variant="subtitle2"
              >
                {dataRow?.student_name ? dataRow?.student_name : `– –`}
              </Typography>
              // </Link>
            )}
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, color: "#092C4CCC" }}
            >
              {Array.isArray(dataRow.custom_application_id) ? (
                <>
                  {dataRow.custom_application_id?.map((id) => (
                    <>
                      {id} <br />
                    </>
                  ))}
                </>
              ) : (
                dataRow.custom_application_id
              )}
            </Typography>
          </Box>
        </Box>
        <DeleteDialogue
          handleDeleteSingleTemplate={handleDeleteTag}
          openDeleteModal={openDeleteDialog}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
          loading={loadingDeleteTag}
          somethingWentWrong={isSomethingWentWrong}
          internalServerError={isInternalServerError}
          apiResponseChangeMessage={apiResponseChangeMessage}
        />
      </Box>

      {/* <Box sx={{ display: "flex", gap: 1.5, pt: 1, width: "50px" }}>
        <Box
          sx={{
            background: applicationStatusColor,
            borderRadius: "50%",
            height: "15px",
            width: "15px",
          }}
        ></Box>
        <Box
          sx={{
            background: dvIndicatorColor,
            borderRadius: "50%",
            height: "15px",
            width: "15px",
          }}
        ></Box>
      </Box> */}
    </>
  );
};

export default RegisteredName;
