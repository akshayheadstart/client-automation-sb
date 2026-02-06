import React, { useState } from "react";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { CloseOutlined } from "@mui/icons-material";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PanelTooltip from "../../components/shared/Tooltip/PanelTooltip";
import SlotDurationAndLImit from "./SlotDurationAndLImit";
const GDSlotList = ({
  slotList,
  handleDrop,
  handleDragOver,
  highlightedSlot,
  typeOfPanel,
  setPanelOrSlot,
  handleCloseDrawer,
  openReschedule,
  setSlotId,
  setSelectedSlots,
  handleUnassignApplicantOrPanelist,
  setSelectedSlotId,
  preview,
  selectedSlots,
  handleGetViewStudentInfoData,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition((prevPosition) => Math.max(prevPosition - 100, 0));
  };

  const scrollRight = () => {
    const container = document.getElementById("student-list-container");
    const maxScroll = container.scrollWidth - container.clientWidth;
    setScrollPosition((prevPosition) =>
      Math.min(prevPosition + 100, maxScroll + 3)
    );
  };

  const setPanelOrSlotAndCloseDrawer = (slotId) => {
    if (openReschedule) {
      setPanelOrSlot(false);
    } else {
      setPanelOrSlot(true); // Handle the case when openReschedule is false
      handleGetViewStudentInfoData(slotId);
    }
    handleCloseDrawer();
  };
  return (
    <Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
      {slotList?.map((list) => (
        <Grid
          onClick={() => {
            if (preview) {
              return;
            } else {
              if (
                list?.status === "published" &&
                list?.application_details?.length
              ) {
                setSlotId(list?._id);
                setSelectedSlotId(list?._id);
                setPanelOrSlotAndCloseDrawer(list?._id);
              } else {
                return;
              }
            }
          }}
          key={list?._id}
          item
          md={12}
          sm={12}
          xs={12}
        >
          <Box
            sx={{
              cursor: "pointer",
              background: list?.status === "published" ? "#dcf8ff" : "",
            }}
            onDragOver={(e) => handleDragOver(e, list?._id)}
            onDrop={(e) => handleDrop(e, list)}
            className={`single-slot-container ${
              highlightedSlot === list._id ? "highlighted-slot" : ""
            }`}
          >
            <SlotDurationAndLImit
              setSelectedSlots={setSelectedSlots}
              list={list}
              selectedSlots={selectedSlots}
            />
            <Box
              sx={{ mt: 0.5, cursor: "pointer" }}
              className="panelist-and-student"
            >
              <Tooltip
                arrow
                placement="top"
                title={
                  <PanelTooltip
                    list={list?.panelist_details}
                    handleUnassign={(id) =>
                      handleUnassignApplicantOrPanelist({
                        slotId: list?._id,
                        panelistId: id,
                      })
                    }
                  />
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    fontSize: 11,
                  }}
                >
                  {list?.panelist_details?.length > 0 ? (
                    <>
                      {list?.panelist_details?.map((panelist) => (
                        <Typography>
                          {panelist ? (
                            <>
                              {panelist?.name?.length > 6
                                ? `${panelist?.name?.substring(0, 6)}..`
                                : panelist?.name}{" "}
                            </>
                          ) : (
                            "--"
                          )}
                        </Typography>
                      ))}
                    </>
                  ) : (
                    "NA"
                  )}
                </Box>
              </Tooltip>
              <Box
                sx={{
                  height: `15px`,
                }}
                className="divider-line"
              ></Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                  overflow: "hidden",
                  fontSize: 11,
                }}
              >
                {list?.application_details?.length ? (
                  <>
                    <IconButton onClick={scrollLeft}>
                      <KeyboardArrowLeftOutlinedIcon />
                    </IconButton>
                    <div
                      id="student-list-container"
                      className="student-list-container"
                    >
                      <ul
                        className="student-list"
                        style={{
                          transform: `translateX(-${scrollPosition}px)`,
                        }}
                      >
                        {list?.application_details?.map((student) => (
                          <li key={student?.application_id}>
                            {student?.student_name}{" "}
                            <CloseOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnassignApplicantOrPanelist({
                                  slotId: list?._id,
                                  applicationId: student?.application_id,
                                });
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <IconButton onClick={scrollRight}>
                      <KeyboardArrowRightOutlinedIcon />
                    </IconButton>
                  </>
                ) : (
                  "NA"
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default GDSlotList;
