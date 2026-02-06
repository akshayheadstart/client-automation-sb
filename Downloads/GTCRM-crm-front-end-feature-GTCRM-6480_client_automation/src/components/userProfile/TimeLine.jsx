/* eslint-disable jsx-a11y/alt-text */
import { Box, Card, Typography } from "@mui/material";
import React from "react";
import counselorAvatarIcon from "../../images/counselorIcon.png";
import userAvatarIcon from "../../images/studentIcon.png";
import systemIcon from "../../images/systemIcon.png";
import "../../styles/newtimeline.css";
import "../../styles/timeline.scss";

const TimeLine = (props) => {
  // this section is for design purpose
  const design = [];
  const nTrials = props?.timeLineData?.length;
  for (let i = 1; i <= nTrials / 2; i++) {
    design.push("1");
    design.push("2");
    design.push("3");
  }
  const extractAndBoldBetweenText = (matchingText,inputText,timeline) => {
 const index = matchingText?.toLowerCase().indexOf(inputText?.toLowerCase());

 if (index === -1) {
   return <span>{matchingText}</span>;
 }
 const beforeText = matchingText.slice(0, index);
 const highlightedText = matchingText.slice(index, index + inputText.length);
 const afterText = matchingText.slice(index + inputText.length);

 return (
   <span>
     {beforeText}
     <b
           onClick={() => {
        if (
          timeline?.template_id &&
          timeline?.template_type
        )
          props?.handleClickEmailTemplateOpen();
        props?.setSelectedEmailTemplateId({
          template_id: timeline?.template_id,
          template_type: timeline?.template_type,
        });
      }}
      style={{cursor:"pointer",textDecoration:"underline",color:"#008CE0"}}
     >{highlightedText}</b>
     {afterText}
   </span>
 );
}


  return (
    <Box>
      <Box sx={{ pb: "20px" }} className="timeline-box-container">
        {props?.timeLineData?.map((timeline, index) => {
          return (
            <>
              <Card
                className={
                  props?.toggle
                    ? "timeline-comment-message-card-design2"
                    : "timeline-comment-message-card-design"
                }
              >
                <Box className="timeline-newMessage-show-container">
                  <Box>
                    <Box
                      className="timeline-user-icon-box"
                      sx={{
                        backgroundColor:
                          timeline?.action_type === "user"
                            ? "rgba(4, 142, 224, 1)"
                            : timeline?.action_type === "counselor"
                            ? "rgba(0, 88, 143, 1)"
                            : "rgba(17, 190, 210, 1)",
                      }}
                    >
                      {timeline?.action_type === "user" && (
                        <img src={userAvatarIcon} />
                      )}
                      {timeline?.action_type === "counselor" && (
                        <img src={counselorAvatarIcon} />
                      )}
                      {timeline?.action_type === "system" && (
                        <img src={systemIcon} />
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography className="timeline-date-time-text">
                      {timeline?.timestamp}
                    </Typography>
                    {
                      timeline?.message && timeline?.template_id && props?.clickEvent?
                      <Typography className="timeline-message-text">
                      {extractAndBoldBetweenText(timeline?.message,timeline?.template_name,timeline)}
                    </Typography>
                    :
                    <Typography className="timeline-message-text">
                    {timeline?.message}
                   </Typography>
                    }
                  
                    
                    {timeline?.["added by"] && (
                      <Typography className="timeline-message-text">
                        <span className="timeline-value-text-header">
                          Added By:{" "}
                        </span>
                        {timeline?.["added by"]}
                      </Typography>
                    )}
                    {timeline?.note && (
                      <Typography className="timeline-message-text">
                        <span className="timeline-value-text-header">
                          Note:{" "}
                        </span>
                        {timeline?.note}
                      </Typography>
                    )}
                    {timeline?.followup_note && (
                      <Typography
                        sx={{ overflowWrap: "break-word" }}
                        className="timeline-message-text"
                      >
                        <span className="timeline-value-text-header">
                          Note:{" "}
                        </span>
                        {timeline?.followup_note}
                      </Typography>
                    )}
                    {timeline?.followup && (
                      <Typography className="timeline-message-text">
                        <span className="timeline-value-text-header">
                          Follow Up:{" "}
                        </span>
                        {timeline?.followup}
                      </Typography>
                    )}
                    {timeline?.assigned_to && (
                      <Typography className="timeline-message-text">
                        <span className="timeline-value-text-header">
                          Assigned To:{" "}
                        </span>
                        {timeline?.assigned_to}
                      </Typography>
                    )}
                    {timeline?.due && (
                      <Typography className="timeline-message-text">
                        <span className="timeline-value-text-header">
                          Due:{" "}
                        </span>
                        {timeline?.due}
                      </Typography>
                    )}
                    {timeline?.created_by && (
                      <Typography className="timeline-message-text">
                        <span className="timeline-value-text-header">
                          Created By:{" "}
                        </span>
                        {timeline?.created_by}
                      </Typography>
                    )}
                    {timeline?.status && (
                      <Typography className="timeline-message-text">
                        <span className="timeline-value-text-header">
                          Status:{" "}
                        </span>
                        {timeline?.status}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
              {/* {
              timeline?.gap_bet_timeline && */}
              {props?.timeLineData.length - 1 !== index && (
                <>
                  <Box>
                    <Box className="timeline-divider-design"></Box>
                    <Box className="timeline-day-text-box">
                      <Typography className="timeline-day-text-size">
                        {timeline?.gap_bet_timeline} Days
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="timeline-divider-design"></Box>
                </>
              )}
              {/* } */}
            </>
          );
        })}
      </Box>
    </Box>
  );
};

export default TimeLine;
