import { Box, Checkbox, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Popover, Whisper } from "rsuite";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ShowDropDownIcon from "./ShowDropDownIcon";
function LeadDetailsInRow({
  details,
  leadProfileAction,
  handleAddSecondaryMobileAndEmailClickOpen,
  setToggleDialogContent,
  userProfileLeadsDetails,
  setFollowupIndex,
  setOpenFollowupStatusUpdateConfirmationModal,
  setFollowupCheckedStatus,
}) {
  const [moreDetails, setMoreDetails] = useState([]);
  const StyledTableCell = useTableCellDesign();

  const speaker = (details) => (
    <Popover>
      <Typography className="followup-status-update-tooltip">
        {details?.upcoming_followup_status === "Incomplete"
          ? "Mark as complete"
          : "Uncheck to incomplete"}
      </Typography>
    </Popover>
  );

  return (
    <>
      <TableRow sx={{ pl: "20px", borderBottom: "1px solid #EEE" }}>
        <StyledTableCell className="lead-details-label-cell">
          <Box
            sx={{
              display: "flex",
              gap: "4px",
            }}
          >
            <Typography className="lead-details-label-cell">
              {" "}
              {details?.label}
            </Typography>
            {details?.subDetails && (
              <ShowDropDownIcon
                Icon={moreDetails?.length ? ArrowDropUpIcon : ArrowDropDownIcon}
                onClick={() =>
                  setMoreDetails((prev) =>
                    prev.length ? [] : details?.subDetails
                  )
                }
              />
            )}
          </Box>
        </StyledTableCell>
        <StyledTableCell className="lead-details-value-cell">
          {details?.hasHoverAction ? (
            <>
              {details?.label === "Primary Email ID" && (
                <Typography
                  className="lead-details-email-text-hover"
                  sx={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Typography className="lead-details-value-cell">
                    {details?.value || "N/A"}
                  </Typography>

                  <Typography
                    onClick={() => {
                      if (!leadProfileAction) {
                        handleAddSecondaryMobileAndEmailClickOpen();
                        setToggleDialogContent(true);
                      }
                    }}
                    className="lead-details-secondary-email-text"
                  >
                    + Secondary Email
                  </Typography>
                </Typography>
              )}
              {details?.label === "Primary Phone Number" && (
                <Typography
                  className="lead-details-mobile-text-hover"
                  sx={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Typography className="lead-details-value-cell">
                    {details?.value ? (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={details?.onClick}
                      >
                        {details?.value}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </Typography>

                  <Typography
                    onClick={() => {
                      if (!leadProfileAction) {
                        handleAddSecondaryMobileAndEmailClickOpen();
                        setToggleDialogContent(false);
                      }
                    }}
                    className="lead-details-secondary-mobile-text"
                  >
                    + Secondary Mobile
                  </Typography>
                </Typography>
              )}
              {details?.label === "Upcoming follow-up:" && (
                <Typography
                  className="lead-details-mobile-text-hover"
                  sx={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Typography className="lead-details-value-cell">
                    {details?.value ? details?.value : "N/A"}
                  </Typography>
                  {details?.value && (
                    <Whisper
                      placement="right"
                      trigger="hover"
                      speaker={speaker(userProfileLeadsDetails?.lead_details)}
                    >
                      <Checkbox
                        checked={
                          userProfileLeadsDetails?.lead_details
                            ?.upcoming_followup_status === "Completed"
                            ? true
                            : false
                        }
                        size="small"
                        color="info"
                        onChange={(e) => {
                          setFollowupIndex(
                            userProfileLeadsDetails?.lead_details
                              ?.upcoming_followup_index
                          );
                          setFollowupCheckedStatus(e.target.checked);
                          setOpenFollowupStatusUpdateConfirmationModal(true);
                        }}
                        sx={{ p: 0 }}
                        disabled={leadProfileAction}
                      />
                    </Whisper>
                  )}
                </Typography>
              )}
            </>
          ) : (
            <>{details?.value === undefined ? "" : details?.value || "N/A"}</>
          )}
        </StyledTableCell>
      </TableRow>
      {moreDetails?.length > 0 && (
        <>
          {moreDetails?.map((subDetails) => (
            <TableRow
              sx={{
                pl: "20px",
                borderBottom: "1px solid #EEE",
                backgroundColor: "rgba(250, 250, 250, 0.95)",
              }}
            >
              <StyledTableCell className="lead-details-label-cell">
                {subDetails?.label}
              </StyledTableCell>
              <StyledTableCell className="lead-details-value-cell">
                {subDetails?.value || "N/A"}
              </StyledTableCell>
            </TableRow>
          ))}
        </>
      )}
    </>
  );
}

export default LeadDetailsInRow;
