import { Box, Button, Drawer, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DateRangePicker, Input, InputGroup, SelectPicker } from "rsuite";
import CloseSVG from "../../../../icons/close.svg";
import BorderLineText from "../AutomationHelperComponent/BorderLineText";
import DataSegmentRecordsTable from "../../DataSegmentManager/DataSegmentRecordsTable";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import DataSegmentListTableAction from "../../DataSegmentManager/DataSegmentListTableAction";
import Cookies from "js-cookie";
import useToasterHook from "../../../../hooks/useToasterHook";
import dayjs from "dayjs";
import { convertToCustomFormat } from "../../../../hooks/GetJsonDate";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SelectDataSegmentDrawer = ({
  openDrawer,
  setOpenDrawer,
  handleManageCreateAutomationDialogue,
}) => {
  const pushNotification = useToasterHook();
  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );

  const navigate = useNavigate();

  const dateArray = [
    dayjs(
      nestedAutomationPayload?.automation_details?.releaseWindow?.start_time
    ),
    dayjs(nestedAutomationPayload?.automation_details?.releaseWindow?.end_time),
  ];
  const customFormat = convertToCustomFormat(dateArray);

  const [selectedDataSegmentList, setSelectedDataSegmentList] = useState([]);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  const [selectedDataSegmentId, setSelectedDataSegmentId] = useState([]);

  const localStorageKeyName = `${Cookies.get(
    "userId"
  )}automationSelectedDataSegmentList`;
  const localStorageKey = "automationSelectedDataSegmentList";

  const [
    dataSegmentRecordsInternalServerError,
    setDataSegmentRecordsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInDataSegmentRecords,
    setSomethingWentWrongInDataSegmentRecords,
  ] = useState(false);

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

  const sumOfDataSegmentCount = selectedDataSegmentList?.reduce(
    (sum, segment) => sum + segment.count_of_entities,
    0
  );

  return (
    <Drawer
      anchor="right"
      onClose={() => setOpenDrawer(false)}
      open={openDrawer}
      PaperProps={{
        sx: {
          width: "600px",
        },
      }}
    >
      <Box className="automation-communication-drawer-header">
        <Box className="create-automation-drawer-title">Create Automation</Box>
        <Box
          onClick={() => setOpenDrawer(false)}
          className="automation-drawer-close-icon"
        >
          <img src={CloseSVG} alt="settingsImage" style={{ width: "100%" }} />
        </Box>
      </Box>

      <Box className="automation-drawer-box">
        <Grid
          rowGap={1.5}
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          columnSpacing={2}
        >
          <Grid item md={6}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <Input
                readOnly
                className="create-automation-input"
                style={{ width: "100%" }}
                placeholder="Name*"
                value={
                  nestedAutomationPayload?.automation_details?.automation_name
                }
              />
              {nestedAutomationPayload?.automation_details?.automation_name && (
                <BorderLineText text={"Name*"} width={32}></BorderLineText>
              )}
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <SelectPicker
                readOnly
                style={{ width: "100%" }}
                className="create-automation-picker"
                placeholder="Select Data Type*"
                data={[
                  {
                    label: "Lead",
                    value: "Lead",
                  },
                  {
                    label: "Application",
                    value: "Application",
                  },
                  {
                    label: "Raw Data",
                    value: "Raw Data",
                  },
                ]}
                value={nestedAutomationPayload?.automation_details?.data_type}
              />

              {nestedAutomationPayload?.automation_details?.data_type && (
                <BorderLineText
                  text={"Select Data Type*"}
                  width={80}
                ></BorderLineText>
              )}
            </Box>
          </Grid>

          <Grid item md={6}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <Box>
                <InputGroup
                  className="create-automation-input"
                  inside
                  style={{ width: "100%" }}
                >
                  <Input
                    className="create-automation-input"
                    placeholder="Release window*"
                    style={{ pointerEvents: "none" }}
                    value={`${
                      nestedAutomationPayload?.automation_details?.releaseWindow
                        ?.start_time &&
                      nestedAutomationPayload?.automation_details?.releaseWindow
                        ?.end_time
                        ? `${customFormat?.start_time?.time} to ${customFormat?.end_time?.time}`
                        : ""
                    }`}
                  />
                  <InputGroup.Addon>
                    <TimeRoundIcon className="communication-release-window-icon" />
                  </InputGroup.Addon>
                </InputGroup>
              </Box>

              {nestedAutomationPayload?.automation_details?.releaseWindow
                ?.start_time &&
                nestedAutomationPayload?.automation_details?.releaseWindow
                  ?.end_time && (
                  <BorderLineText
                    text={"Communication Release window*"}
                    width={150}
                  ></BorderLineText>
                )}
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <DateRangePicker
                readOnly
                appearance="subtle"
                placeholder="Start Date & End Date*"
                value={
                  nestedAutomationPayload?.automation_details?.date?.start_date
                    ? [
                        new Date(
                          nestedAutomationPayload?.automation_details?.date?.start_date
                        ),
                        new Date(
                          nestedAutomationPayload?.automation_details?.date?.end_date
                        ),
                      ]
                    : []
                }
                placement="bottomEnd"
                style={{ width: "100%" }}
                className="date-range-btn-automation"
              />
              {nestedAutomationPayload?.automation_details?.date?.start_date
                ?.length > 0 &&
                nestedAutomationPayload?.automation_details?.date?.end_date
                  ?.length > 0 && (
                  <BorderLineText
                    text={"Start Date & End Date*"}
                    width={105}
                  ></BorderLineText>
                )}
            </Box>
          </Grid>
        </Grid>

        <Box className="data-segment-table-container">
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
            from="create-automation"
            localStorageKeyName={localStorageKeyName}
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
              from="create-automation"
              localStorageKey={localStorageKey}
              selectedDataSegmentId={selectedDataSegmentId}
              setSelectedDataSegmentId={setSelectedDataSegmentId}
              sumOfDataSegmentCount={sumOfDataSegmentCount}
            />
          )}
        </Box>
      </Box>
      <Box className="select-data-segment-drawer-buttons">
        <Button
          sx={{ color: "#008BE2 !important" }}
          className="common-outlined-button"
          onClick={() => {
            setOpenDrawer(false);
            handleManageCreateAutomationDialogue(true);
          }}
        >
          Back
        </Button>
        <Button
          className="common-contained-button"
          onClick={() => {
            if (!selectedDataSegmentList?.length > 0) {
              pushNotification("warning", "Please select data segment");
            } else {
              const updatedNestedAutomationPayload = {
                ...nestedAutomationPayload,
                automation_details: {
                  ...nestedAutomationPayload?.automation_details,
                  data_count: sumOfDataSegmentCount,
                  data_segment: selectedDataSegmentList,
                },
              };

              navigate("/create-automation", {
                state: {
                  template: false,
                  automationPayload: updatedNestedAutomationPayload,
                },
              });
            }
          }}
        >
          Continue
        </Button>
      </Box>
    </Drawer>
  );
};

export default SelectDataSegmentDrawer;
