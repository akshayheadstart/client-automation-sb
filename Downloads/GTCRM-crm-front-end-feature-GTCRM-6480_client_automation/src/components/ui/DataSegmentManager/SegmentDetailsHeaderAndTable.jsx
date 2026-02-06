import { Box, Card } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetDataSegmentDetailsTableDataQuery,
  usePrefetch,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { defaultHeader } from "../../../constants/LeadStageList";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import SegmentDetailsHeader from "./SegmentDetailsHeader";
import SegmentDetailsTable from "./SegmentDetailsTable";
import DataSegmentDetailsFilters from "./DataSegmentDetailsFilters";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import useDebounce from "../../../hooks/useDebounce";

function SegmentDetailsHeaderAndTable({
  setShowAddLeadPage,
  dataSegmentId,
  token,
  setDataType,
  setPermissionData,
  dataType,
}) {
  const [addedColumn, setAddedColumn] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedLeadStage, setSelectedLeadStage] = useState(false);
  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [applications, setApplications] = useState([]);
  const [tableHeadList, setTableHeadList] = useState(defaultHeader);

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  const [totalApplication, setTotalApplication] = useState(0);
  const [showAddLeadButton, setShowAddLeadButton] = useState(false);
  const [leadProfileAction, setLeadProfileAction] = useState(false);
  const [allApplicationPayload, setAllApplicationPayload] = useState({});

  const [shouldShowAddColumn, setShouldShowAddColumn] = useState(false);
  const [showFilterOption, setShowFilterOption] = useState(false);

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedMobileNumbers, setSelectedMobileNumbers] = useState([]);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const pushNotification = useToasterHook();
  const [applyBasicFilter, setApplyBasicFilter] = useState(false);
  const debouncedSearchText = useDebounce(searchText);

  const { data, isError, error, isFetching, isSuccess } =
    useGetDataSegmentDetailsTableDataQuery({
      collegeId,
      dataSegmentId,
      pageNumber,
      rowsPerPage,
      searchText: debouncedSearchText,
      token,
      payload: allApplicationPayload,
      applyBasicFilter,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setApplications(data.data);
          setTotalApplication(data?.total);
          setShowAddLeadButton(
            data?.permission === "contributor" && data?.close === false
              ? true
              : false
          );
          setLeadProfileAction(
            data?.permission === "contributor" && data?.close === false
              ? false
              : true
          );
          setDataType(data?.data_type);
        } else {
          throw new Error("Data segment details API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          if (error?.data?.detail === "Not enough permissions") {
            setPermissionData(true);
          }
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

  const prefetchAllApplications = usePrefetch("getDataSegmentDetailsTableData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllApplications,
      {
        payload: allApplicationPayload,
        dataSegmentId,
        searchText: debouncedSearchText,
        token,
        applyBasicFilter,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchAllApplications, rowsPerPage, token]);

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
    const payload = { ...allApplicationPayload };
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
    setAllApplicationPayload(payload);
  };

  return (
    <Card
      className="common-box-shadow"
      sx={{ borderRadius: 3, py: 3.5, px: 3 }}
    >
      <SegmentDetailsHeader
        setShouldShowAddColumn={setShouldShowAddColumn}
        shouldShowAddColumn={shouldShowAddColumn}
        setShowFilterOption={setShowFilterOption}
        showFilterOption={showFilterOption}
        addedColumn={addedColumn}
        setAddedColumn={setAddedColumn}
        searchText={searchText}
        setSearchText={setSearchText}
        setTableHeadList={setTableHeadList}
        setShowAddLeadPage={setShowAddLeadPage}
        showAddLeadButton={showAddLeadButton}
        setPageNumber={setPageNumber}
        token={token}
        collegeID={collegeId}
        segmentId={dataSegmentId}
        setApiResponseChangeMessage={setApiResponseChangeMessage}
        setIsSomethingWentWrong={setIsSomethingWentWrong}
        setIsInternalServerError={setIsInternalServerError}
      />
      {(showFilterOption || shouldShowAddColumn) && (
        <Box
          className={
            showFilterOption || shouldShowAddColumn
              ? "show-all-the-filters"
              : "hide-all-the-filters"
          }
        >
          <DataSegmentDetailsFilters
            isTypeLead={dataType === "Lead"}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            addedColumn={addedColumn}
            setAddedColumn={setAddedColumn}
            setShouldShowAddColumn={setShouldShowAddColumn}
            shouldShowAddColumn={shouldShowAddColumn}
            showFilterOption={showFilterOption}
            setSelectedApplications={setSelectedApplications}
            setSelectedEmails={setSelectedEmails}
            setSelectedMobileNumbers={setSelectedMobileNumbers}
            setAllApplicationPayload={setAllApplicationPayload}
            allApplicationPayload={allApplicationPayload}
            setApplyBasicFilter={setApplyBasicFilter}
          />
        </Box>
      )}
      {hideTable || (
        <SegmentDetailsTable
          setSelectedEmails={setSelectedEmails}
          selectedEmails={selectedEmails}
          setSelectedMobileNumbers={setSelectedMobileNumbers}
          selectedMobileNumbers={selectedMobileNumbers}
          applications={applications}
          tableHeadList={tableHeadList}
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
          showActions={true}
          leadProfileAction={leadProfileAction}
          dataType={dataType}
          dataSegmentId={dataSegmentId}
        />
      )}
    </Card>
  );
}

export default SegmentDetailsHeaderAndTable;
