import { Box, Button, Typography } from "@mui/material";
import React, { useRef } from "react";
import { CheckPicker, Checkbox, Drawer, SelectPicker } from "rsuite";
import Calender from "../Calendar/Calendar";
import "../../styles/MODDesignPage.css";
import "../../styles/PanellistDesignPage.css";
import CloseIcon from "@mui/icons-material/Close";
const CalendarDrawer = ({
  open,
  placement,
  setOpen,
  formattedDate,
  dataInfo,
  courseListInfo,
  dataCourse,
  selectedProgram,
  setSelectedProgram,
  setCallFilterOptionApi,
  footerStyles,
  allValue,
  handleCheckAll,
  footerButtonStyle,
  slotStatus,
  dataModerator,
  dataPublish,
  setCurrentDate,
  setDate,
  setFilterSlotStatus,
  setFilterModerator,
  setFilterState,
  handleApplyFilter,
  setFilterSlot,
  applyFilterPayload,
  allModeratorList,
  selectedModerator,
  setSelectedModerator,
  handleModeratorCheckAll,
  allModeratorValue,
  setCallModeratorOptionApi,
  filterDataPayload,
  programRef,
  setPanelOrSlot,
  setReschedule,
  setCheckBoxSlotIndex
}) => {
  const dateSplit = formattedDate?.split(" ");
  const programRef2 = useRef();
  return (
    <Drawer
      size={"md"}
      placement={placement}
      open={open}
      onClose={() => setOpen(false)}
     
    >
      <Drawer.Body>
        <Box sx={{ display: "flex",justifyContent:'space-between',alignItems:'center' }}>
        <CloseIcon  sx={{ cursor: "pointer",marginLeft:'-42px',marginTop:'-14px' }} onClick={()=>setOpen(false)} />
          <Typography
            sx={{ color: "#039BDC", fontSize: "25px", fontWeight: 800 }}
          >
            {dateSplit[1]?.slice(0, 2)} {dateSplit[0]} {dateSplit[2]}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", mt: 10, gap: 3, flexWrap: "wrap" }}>
          <CheckPicker
            data={dataInfo}
            searchable={false}
            style={{ width: 120 }}
            placeholder="Filter Slots"
            onChange={(event) => setFilterSlot(event)}
          />
          <CheckPicker
            style={{ width: 150 }}
            ref={programRef2}
            loading={
              courseListInfo.isFetching ? courseListInfo.isFetching : false
            }
            placeholder="Select Program"
            className="select-picker"
            data={dataCourse}
            value={selectedProgram}
            onChange={(value) => {
              setSelectedProgram(value);
            }}
            placement="bottomStart"
            onOpen={() => {
              setCallFilterOptionApi &&
                setCallFilterOptionApi((prev) => ({
                  ...prev,
                  skipCourseApiCall: false,
                }));
            }}
            renderExtraFooter={() => (
              <div style={footerStyles}>
                <Checkbox
                  indeterminate={
                    selectedProgram?.length > 0 &&
                    selectedProgram?.length < allValue?.length
                  }
                  checked={selectedProgram?.length === allValue?.length}
                  onChange={handleCheckAll}
                >
                  Check all
                </Checkbox>
                {selectedProgram?.length > 0 ? (
                  <Button
                    style={footerButtonStyle}
                    appearance="primary"
                    size="sm"
                    onClick={() => {
                      programRef2.current.close();
                    }}
                  >
                    Close
                  </Button>
                ) : (
                  <Button
                    style={footerButtonStyle}
                    appearance="primary"
                    size="sm"
                    onClick={() => {
                      programRef2.current.close();
                    }}
                  >
                    Ok
                  </Button>
                )}
              </div>
            )}
          />
          <CheckPicker
            data={slotStatus}
            searchable={false}
            style={{ width: 120 }}
            placeholder="Slots Status"
            onChange={(event) => setFilterSlotStatus(event)}
          />
          <CheckPicker
            style={{ width: 150 }}
            ref={programRef}
            loading={
              allModeratorList.isFetching ? allModeratorList.isFetching : false
            }
            placeholder="Select Moderator"
            className="select-picker"
            data={dataModerator}
            value={selectedModerator}
            onChange={(value) => {
              setSelectedModerator(value);
            }}
            placement="bottomStart"
            onOpen={() => {
              setCallModeratorOptionApi &&
                setCallModeratorOptionApi((prev) => ({
                  ...prev,
                  skipModeratorApiCall: false,
                }));
            }}
            renderExtraFooter={() => (
              <div style={footerStyles}>
                <Checkbox
                  indeterminate={
                    selectedModerator?.length > 0 &&
                    selectedModerator?.length < allModeratorValue?.length
                  }
                  checked={
                    selectedModerator?.length === allModeratorValue?.length
                  }
                  onChange={handleModeratorCheckAll}
                >
                  Check all
                </Checkbox>
                {selectedModerator?.length > 0 ? (
                  <Button
                    style={footerButtonStyle}
                    appearance="primary"
                    size="sm"
                    onClick={() => {
                      programRef.current.close();
                    }}
                  >
                    Close
                  </Button>
                ) : (
                  <Button
                    style={footerButtonStyle}
                    appearance="primary"
                    size="sm"
                    onClick={() => {
                      programRef.current.close();
                    }}
                  >
                    Ok
                  </Button>
                )}
              </div>
            )}
          />
          <SelectPicker
            data={dataPublish}
            searchable={false}
            style={{ width: 120 }}
            placeholder="Slot State"
            onChange={(event) => setFilterState(event)}
          />
          <Button
            sx={{ borderRadius: 50, paddingX: 4, whiteSpace: "nowrap" }}
            color="info"
            variant="contained"
            size="small"
            onClick={() => handleApplyFilter()}
          >
            Apply Filter
          </Button>
        </Box>
        <Box sx={{ mt: 10, border: "1px solid #E7E8EA"}} className='calendar-box-scroll-container'>
          <Calender
            setOpen={setOpen}
            setCurrentDateToCalenderMOD={setCurrentDate}
            setDate={setDate}
            applyFilterPayload={applyFilterPayload}
            filterDataPayload={filterDataPayload}
            setPanelOrSlot={setPanelOrSlot}
            setReschedule={setReschedule}
            setCheckBoxSlotIndex={setCheckBoxSlotIndex}
          ></Calender>
        </Box>
      </Drawer.Body>
    </Drawer>
  );
};

export default CalendarDrawer;
