import React, { useContext, useEffect, useState } from "react";
import SegmentDetailsTable from "./SegmentDetailsTable";
import { defaultHeader } from "../../../constants/LeadStageList";
import { Card } from "@mui/material";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import {
  useGetDataSegmentDetailsAddLeadTableDataQuery,
  usePrefetch,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";

function AddLeadToSegmentTable({
  moduleName,
  searchText,
  selectedApplications,
  setSelectedApplications,
  setPageNumber,
  pageNumber,
}) {
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  const [selectedLeadStage, setSelectedLeadStage] = useState(false);
  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [applications, setApplications] = useState([]);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  const [totalApplication, setTotalApplication] = useState(0);
  const [payload, setPayload] = useState({});

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const pushNotification = useToasterHook();

  const { data, isError, error, isFetching, isSuccess } =
    useGetDataSegmentDetailsAddLeadTableDataQuery({
      collegeId,
      pageNumber,
      rowsPerPage,
      searchText,
      payload: payload,
      dataType:moduleName,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setApplications(data.data);
          setTotalApplication(data?.total);
        } else {
          throw new Error(
            "Data segment details add lead API response has changed"
          );
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
            setHideTable,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideTable, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  const prefetchAllApplications = usePrefetch(
    "getDataSegmentDetailsAddLeadTableData"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllApplications,
      { payload: payload, searchText, dataType: moduleName }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchAllApplications, rowsPerPage]);

  const quickFilterList = [
    {
      label: "Fresh Lead",
      color: "#00B087",
      value: true,
      stateValue: selectedLeadStage,
      setStateValue: setSelectedLeadStage,
      isChecked: selectedLeadStage,
    },
    {
      label: "Verified",
      color: "#008BE2",
      value: true,
      stateValue: selectedVerificationStatus,
      setStateValue: setSelectedVerificationStatus,
      isChecked: selectedVerificationStatus,
    },
    {
      label: "Paid lead",
      color: "#1D8F00",
      value: true,
      stateValue: paymentStatus,
      setStateValue: setPaymentStatus,
      isChecked: paymentStatus,
    },
  ];

  const handleApplyQuickFilters = () => {
    const payload = {};
    if (selectedLeadStage) {
      payload.fresh_lead = true;
    }
    if (selectedVerificationStatus) {
      payload.is_verify = true;
    }
    if (paymentStatus) {
      payload.payment_status = true;
    }
    setPageNumber(1);
    setPayload(payload);
  };

  return (
    <>
      {!hideTable && (
        <Card
          className="common-box-shadow"
          sx={{ borderRadius: 3, py: 3.5, px: 3, mt: 2.5 }}
        >
          <SegmentDetailsTable
            applications={applications}
            tableHeadList={defaultHeader}
            quickFilterList={quickFilterList}
            setIsScrolledToPagination={setIsScrolledToPagination}
            isScrolledToPagination={isScrolledToPagination}
            selectedApplications={selectedApplications}
            setSelectedApplications={setSelectedApplications}
            isLoading={isFetching}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalApplication={totalApplication}
            isInternalServerError={isInternalServerError}
            isSomethingWentWrong={isSomethingWentWrong}
            apiResponseChangeMessage={apiResponseChangeMessage}
            handleApplyQuickFilters={handleApplyQuickFilters}
          />
        </Card>
      )}
    </>
  );
}

export default AddLeadToSegmentTable;
