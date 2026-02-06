import { Card, Checkbox, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Popover, Timeline, Whisper } from "rsuite";

const FollowupDetails = ({
  details,
  setOpenFollowupStatusUpdateConfirmationModal,
  setFollowupCheckedStatus,
  setFollowupIndex,
  leadProfileAction
}) => {
  const [cardHeight, setCardHeight] = useState(0);
  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.clientHeight);
  }, []);
  const speaker = (details) => (
    <Popover>
      <Typography className="followup-status-update-tooltip">
        {details?.status === "Incomplete"
          ? "Mark as complete"
          : "Uncheck to incomplete"}
      </Typography>
    </Popover>
  );

  return (
    <Timeline.Item
      dot={
        <div className="followup-custom-dot">
          <div style={{ top: `${cardHeight / 2}px` }}></div>{" "}
          <div style={{ top: `${cardHeight / 2 - 4}px` }}></div>
        </div>
      }
    >
      <Card
        className="followup-details-card common-white-bg-box-shadow"
        sx={{ p: 2 }}
        ref={cardRef}
      >
        <Typography className="followup-and-note-title">
          {details.timestamp || "N/A"}
        </Typography>
        <Typography> Followup : {details.followup || "N/A"}</Typography>
        <Typography>Note : {details?.followup_note || "N/A"}</Typography>
        <Typography>Assigned to : {details.assigned_to || "N/A"}</Typography>
        <Typography>Due : {details.due || "N/A"}</Typography>
        <Typography>Created By : {details.created_by || "N/A"}</Typography>
        <Typography>
          Status : {details.status || "N/A"}{" "}
          <Whisper placement="right" trigger="hover" speaker={speaker(details)}>
            <Checkbox
              color="info"
              checked={details?.status === "Completed" ? true : false}
              onChange={(e) => {
                setFollowupIndex(details?.index_number);
                setFollowupCheckedStatus(e.target.checked);
                setOpenFollowupStatusUpdateConfirmationModal(true);
              }}
              sx={{ p: 0 }}
              disabled={leadProfileAction}
            />
          </Whisper>
        </Typography>
      </Card>
    </Timeline.Item>
  );
};

export default FollowupDetails;
