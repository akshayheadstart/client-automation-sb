import { Box, Card, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import crossImage from "../../../icons/cross-icon.svg";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux/es";
import useToasterHook from "../../../hooks/useToasterHook";
import {
  useDeleteReportTemplateMutation,
  useGetReportTemplatesQuery,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import DeleteDialogue from "../../shared/Dialogs/DeleteDialogue";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
const ReportTemplates = ({
  setTitle,
  setOpenDrawer,
  setSelectedSingleData,
  setReportTemplateId,
  setReportTemplateCount,
  setReadOnlyToggle
}) => {
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [listOfReports, setListOfReports] = useState([]);
  const [hideHeader, setHideHeader] = useState(false);
  const [deleteApiLoading, setDeleteApiLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState("");

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const { data, isError, error, isFetching, isSuccess } =
    useGetReportTemplatesQuery({
      collegeId,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setListOfReports(data?.data);
          setReportTemplateCount(data?.data?.length);
        } else {
          throw new Error("Report template GET API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideHeader,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideHeader, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, error, isSuccess]);

  const [deleteReportTemplate] = useDeleteReportTemplateMutation();

  const handleDeleteReportTemplate = () => {
    setDeleteApiLoading(true);
    deleteReportTemplate({
      collegeId,
      payload: [deleteTemplateId],
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          try {
            if (typeof res.message === "string") {
              pushNotification("success", res.message);
            } else {
              throw new Error("automation get by id API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
          }
        } else if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((error) => {
        if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        }
      })
      .finally(() => {
        setDeleteApiLoading(false);
        setOpenDeleteModal(false);
      });
  };

  return (
    <Card
      sx={{ display: hideHeader ? "none" : "block" }}
      className="common-box-shadow report-template-container"
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <>
              <Box
                sx={{ minHeight: "10vh" }}
                className="common-not-found-container"
              >
                <LeefLottieAnimationLoader
                  height={100}
                  width={100}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              {" "}
              <Typography>Report Template</Typography>{" "}
              {listOfReports?.length > 0 ? (
                <Box>
                  {listOfReports.map((template) => (
                    <Typography
                      onClick={() => {
                        setSelectedSingleData(template);
                        setTitle(template?.report_name);
                        setOpenDrawer(true);
                        setReportTemplateId(template?._id);
                        setReadOnlyToggle(false)
                      }}
                      key={template?._id}
                    >
                      {template?.report_name}
                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDeleteModal(true);
                          setDeleteTemplateId(template?._id);
                        }}
                        src={crossImage}
                        alt="crossImage"
                      />
                    </Typography>
                  ))}
                </Box>
              ) : (
                <BaseNotFoundLottieLoader width={100} height={100} />
              )}
            </>
          )}
        </>
      )}
      <DeleteDialogue
        loading={deleteApiLoading}
        openDeleteModal={openDeleteModal}
        handleCloseDeleteModal={() => setOpenDeleteModal(false)}
        internalServerError={isInternalServerError}
        somethingWentWrong={isSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
        handleDeleteSingleTemplate={handleDeleteReportTemplate}
      />
    </Card>
  );
};

export default ReportTemplates;
