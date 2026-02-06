import { Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const HistoryDetailsTableData = ({ rawDataDetails }) => {
  const navigate = useNavigate();
  return (
    <Tooltip
      arrow
      placement="left"
      title={rawDataDetails?.count && "Click to view"}
    >
      <span
        onClick={() =>
          navigate("/lead-process", {
            state: {
              ...rawDataDetails,
            },
          })
        }
        className={rawDataDetails?.count ? "history-table-data" : ""}
      >
        {rawDataDetails?.count || 0}
      </span>
    </Tooltip>
  );
};

export default HistoryDetailsTableData;
