import { Grid, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import PanelTooltip from "../../components/shared/Tooltip/PanelTooltip";
import SlotDurationAndLImit from "./SlotDurationAndLImit";

const SlotList = ({
  slotList,
  handleDrop,
  handleDragOver,
  highlightedSlot,
  typeOfPanel,
  setPanelOrSlot,
  handleCloseDrawer,
  setSelectedSlots,
  openReschedule,
  setIsScrolledGetInterViewStudentInfo,
  setSlotId,
  handleUnassignApplicantOrPanelist,
  setSelectedSlotId,
  preview,
  selectedSlots,
  panelOrSlotDetails,
  handleGetViewStudentInfoData,
}) => {
  const handleClickSlot = (slotId) => {
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
      {slotList?.map((list, index) => (
        <Grid
          key={list._id}
          item
          md={typeOfPanel === "gd" ? 12 : typeOfPanel === "pi" ? 4 : 3}
          sm={typeOfPanel ? 12 : 6}
          xs={12}
          onClick={() => {
            if (preview) {
              return;
            } else {
              if (
                list?.status === "published" &&
                list?.application_details?.length
              ) {
                handleClickSlot(list?._id);
                setSlotId(list?._id);
                setSelectedSlotId(list?._id);
                
              } else {
                return;
              }
            }
          }}
        >
          <Box
            onDragOver={(e) => handleDragOver(e, list._id)}
            onDrop={(e) => handleDrop(e, list, index)}
            className={`single-slot-container ${
              highlightedSlot === list._id ? "highlighted-slot" : ""
            }`}
            sx={{
              cursor: "pointer",
              background: list?.status === "published" ? "#dcf8ff" : "",
            }}
          >
            <SlotDurationAndLImit
              setSelectedSlots={setSelectedSlots}
              list={list}
              selectedSlots={selectedSlots}
              slotType={panelOrSlotDetails?.slot_type}
            />
            <Box sx={{ mt: 0.5 }} className="panelist-and-student">
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
                disableHoverListener={
                  list?.panelist_details?.length ? false : true
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
                              {panelist?.name?.length > 4
                                ? `${panelist?.name?.substring(0, 4)}..`
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
              <Tooltip
                arrow
                placement="top"
                title={
                  <PanelTooltip
                    list={list?.application_details}
                    handleUnassign={(id) =>
                      handleUnassignApplicantOrPanelist({
                        slotId: list?._id,
                        applicationId: id,
                      })
                    }
                  />
                }
                disableHoverListener={
                  list?.application_details?.length ? false : true
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                    overflow: "hidden",
                    fontSize: 11,
                  }}
                >
                  {list?.application_details?.length > 0 ? (
                    <>
                      {list?.application_details?.map((student) => (
                        <>
                          <Typography
                            className={
                              typeOfPanel === "gd" ? "show-border" : ""
                            }
                          >
                            {student ? (
                              <>
                                {list.type === "PI" ? (
                                  <>
                                    {student?.student_name?.length > 20
                                      ? `${student?.student_name?.substring(
                                          0,
                                          20
                                        )}...`
                                      : student?.student_name}{" "}
                                  </>
                                ) : (
                                  <>
                                    {typeOfPanel === "gd" ? (
                                      <>
                                        {student?.student_name?.length > 8
                                          ? `${student?.student_name?.substring(
                                              0,
                                              8
                                            )}...`
                                          : student?.student_name}{" "}
                                      </>
                                    ) : (
                                      <>
                                        {student?.student_name?.length > 2
                                          ? `${student?.student_name?.substring(
                                              0,
                                              2
                                            )}...`
                                          : student?.student_name}{" "}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              "--"
                            )}
                          </Typography>
                        </>
                      ))}
                    </>
                  ) : (
                    "NA"
                  )}
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SlotList;
