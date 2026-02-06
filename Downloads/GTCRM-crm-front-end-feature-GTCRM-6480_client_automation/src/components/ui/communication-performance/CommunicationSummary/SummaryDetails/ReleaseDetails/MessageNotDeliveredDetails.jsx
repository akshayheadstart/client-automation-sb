import React, { useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import MessageNotDeliveredDetailsDrawer from "./MessageNotDeliveredDetailsDrawer";
const MessageNotDeliveredDetails = ({ count }) => {
  const [openNotDeliveredDetailsDrawer, setOpenNotDeliveredDetailsDrawer] =
    useState(false);
  return (
    <>
      <span className="message-not-delivered-count">
        {count} <LaunchIcon onClick={setOpenNotDeliveredDetailsDrawer} />{" "}
      </span>

      {openNotDeliveredDetailsDrawer && (
        <MessageNotDeliveredDetailsDrawer
          open={openNotDeliveredDetailsDrawer}
          setOpen={setOpenNotDeliveredDetailsDrawer}
        />
      )}
    </>
  );
};

export default MessageNotDeliveredDetails;
