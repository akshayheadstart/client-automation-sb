/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DataSegmentQuickView from "../../components/ui/DataSegmentManager/DataSegmentQuickView";
import DataSegmentRecordsTable from "../../components/ui/DataSegmentManager/DataSegmentRecordsTable";
import DataSegmentListTableAction from "../../components/ui/DataSegmentManager/DataSegmentListTableAction";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import Cookies from "js-cookie";
import { useUpdateDataSegmentStatusMutation } from "../../Redux/Slices/dataSegmentSlice";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import useToasterHook from "../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/DataSegmentQuickView.css";
import SelectAutomationDrawer from "../../components/ui/DataSegmentManager/SelectAutomationDrawer";
const DataSegmentManager = () => {
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const [openSelectAutomationDrawer, setOpenSelectAutomationDrawer] =
    useState(false);

  const [selectedDataSegmentList, setSelectedDataSegmentList] = useState([]);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [selectedDataSegmentId, setSelectedDataSegmentId] = useState([]);

  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

  const [
    dataSegmentRecordsInternalServerError,
    setDataSegmentRecordsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInDataSegmentRecords,
    setSomethingWentWrongInDataSegmentRecords,
  ] = useState(false);

  const localStorageKeyName = `${Cookies.get("userId")}selectedDataSegmentList`;
  const localStorageKey = "selectedDataSegmentList";

  //selected item actions section
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();

  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const [updateDataSegmentStatus] = useUpdateDataSegmentStatusMutation();
  function handleSelectDataSegmentStatus(selectedStatus, dataSegmentId) {
    setLoadingChangeStatus(true);
    updateDataSegmentStatus({
      collegeId,
      payload: {
        data_segments_ids: dataSegmentId
          ? [dataSegmentId]
          : selectedDataSegmentId,
        status: selectedStatus,
      },
    })
      .unwrap()
      .then((data) => {
        try {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            pushNotification("success", data?.message);
            setSelectedDataSegmentList([]);
            setSelectedDataSegmentId([]);
            localStorage.removeItem(
              `${Cookies.get("userId")}${localStorageKey}`
            );
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInDataSegmentRecords,
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
            setDataSegmentRecordsInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => setLoadingChangeStatus(false));
  }
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Campaign manager Head Title add
  useEffect(() => {
    setHeadTitle("Data Segment Manager");
    document.title = "Data Segment Manager";
  }, [headTitle]);
  return (
    <Box sx={{ px: 3 }} className='DataSegment-container-box'>
      <DataSegmentQuickView />
      <DataSegmentRecordsTable
        selectedDataSegmentList={selectedDataSegmentList}
        setSelectedDataSegmentList={setSelectedDataSegmentList}
        paginationRef={paginationRef}
        setDataSegmentRecordsInternalServerError={
          setDataSegmentRecordsInternalServerError
        }
        dataSegmentRecordsInternalServerError={
          dataSegmentRecordsInternalServerError
        }
        setSomethingWentWrongInDataSegmentRecords={
          setSomethingWentWrongInDataSegmentRecords
        }
        somethingWentWrongInDataSegmentRecords={
          somethingWentWrongInDataSegmentRecords
        }
        localStorageKeyName={localStorageKeyName}
        handleSelectDataSegmentStatus={handleSelectDataSegmentStatus}
        selectedDataSegmentId={selectedDataSegmentId}
        setSelectedDataSegmentId={setSelectedDataSegmentId}
      />
      {selectedDataSegmentList?.length > 0 && (
        <DataSegmentListTableAction
          isScrolledToPagination={isScrolledToPagination}
          selectedDataSegmentList={selectedDataSegmentList}
          setSelectedDataSegmentList={setSelectedDataSegmentList}
          setInternalServerError={setDataSegmentRecordsInternalServerError}
          setSomethingWentWrong={setSomethingWentWrongInDataSegmentRecords}
          localStorageKey={localStorageKey}
          handleSelectDataSegmentStatus={handleSelectDataSegmentStatus}
          loadingChangeStatus={loadingChangeStatus}
          selectedDataSegmentId={selectedDataSegmentId}
          setSelectedDataSegmentId={setSelectedDataSegmentId}
          setOpenSelectAutomationDrawer={setOpenSelectAutomationDrawer}
        />
      )}

      {openSelectAutomationDrawer && (
        <SelectAutomationDrawer
          openDrawer={openSelectAutomationDrawer}
          setOpenDrawer={setOpenSelectAutomationDrawer}
          selectedDataSegmentList={selectedDataSegmentList}
        />
      )}
    </Box>
  );
};

export default DataSegmentManager;
