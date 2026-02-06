import React from "react";
import { useState } from "react";
import { Tag } from "rsuite";
import { TagColorCode } from "../../../../constants/LeadStageList";

const ShowTag = ({ handleOnClose, tag, studentId, index }) => {
  const [showClose, setShowClose] = useState(false);
  return (
    <Tag
      onMouseLeave={() => setShowClose(false)}
      onMouseOver={() => setShowClose(true)}
      onClose={() => handleOnClose(tag, studentId)}
      closable={showClose}
      style={{
        backgroundColor: TagColorCode[index],
        color: "white",
        borderRadius: "0px 0px 5px 5px",
      }}
    >
      {tag}
    </Tag>
  );
};

export default ShowTag;
