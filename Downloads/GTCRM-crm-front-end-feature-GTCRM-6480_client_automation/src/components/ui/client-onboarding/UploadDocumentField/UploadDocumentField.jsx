import React, { useContext, useState } from "react";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import {
  useDeleteUploadDocumentFieldMutation,
  useGetUploadDocumentDataQuery,
  useUpdateUploadDocumentFieldMutation,
} from "../../../../Redux/Slices/clientOnboardingSlice";
import useToasterHook from "../../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";
import UploadDocumentFieldShared from "./UploadDocumentFieldShared";

const UploadDocumentField = ({ clientId, collegeId }) => {
  const [uploadDocumentFields, setUploadDocumentFields] = useState([]);
  const pushNotification = useToasterHook();
  const [
    somethingWentWrongInUploadDocument,
    setSomethingWentWrongInUploadDocument,
  ] = useState(false);
  const [
    uploadDocumentInternalServerError,
    setUploadDocumentInternalServerError,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  //Particular Document Field Delete APi implementation here
  const [deleteUploadDocument] = useDeleteUploadDocumentFieldMutation();
  const handleUploadDocumentFieldDelete = (keyname) => {
    setUpdateStatusLoading(true);
    deleteUploadDocument({
      keyName: keyname,
      clientId: clientId,
      collegeId: collegeId,
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
          } else {
            throw new Error(
              "Document Field Delete API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInUploadDocument,
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
            setUploadDocumentInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setUpdateStatusLoading(false);
      });
  };
  //Particular Document Field Update APi implementation here
  const [updateUploadDocument] = useUpdateUploadDocumentFieldMutation();
  const handleUploadDocumentFieldUpdate = (updatedField,editingIndex, sectionIndex) => {
    setUpdateStatusLoading(true);
    updateUploadDocument({
      payload:updatedField,
      clientId: clientId,
      collegeId: collegeId,
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
          } else {
            throw new Error(
              "Document Field Update API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInUploadDocument,
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
            setUploadDocumentInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setUpdateStatusLoading(false);
      });
  };
  const handleDeleteField = (fieldIndex) => {
    const fieldToDelete = uploadDocumentFields[fieldIndex];
    if (fieldToDelete) {
      handleUploadDocumentFieldDelete(fieldToDelete?.key_name);
    }
  };
  //Get upload document fields api call here
  const { data, isSuccess, isError, error, isFetching } =
    useGetUploadDocumentDataQuery({
      collegeId,
      clientId:collegeId?"":clientId,
    });
  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.data) {
          try {
            if (data?.data) {
              setUploadDocumentFields(data?.data);
            } else {
              throw new Error(
                "Get Upload document field API response has changed"
              );
            }
          } catch (error) {}
        } else if (data?.detail) {
          setUploadDocumentFields([]);
          pushNotification("error", data?.detail);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(
            setUploadDocumentInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(
        setSomethingWentWrongInUploadDocument,
        "",
        10000
      );
    }
  }, [data, isSuccess, isError, error, isFetching]);
  return (
    <>
      {uploadDocumentInternalServerError ||
      somethingWentWrongInUploadDocument ? (
        <Box>
          {uploadDocumentInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInUploadDocument && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <UploadDocumentFieldShared
          uploadDocumentFields={uploadDocumentFields}
          setUploadDocumentFields={setUploadDocumentFields}
          handleDeleteField={handleDeleteField}
          handleEditField={handleUploadDocumentFieldUpdate}
          hideSaveBtn={true}
          collegeId={collegeId}
          isFetchingDefaultForm={isFetching}
          clientId={clientId}
          title={"Upload Document Form Fields"}
        />
      )}
    </>
  );
};

export default UploadDocumentField;
