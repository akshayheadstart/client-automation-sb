import React from "react";

const AscendingDescendingImg = ({ icon, onClick, style }) => {
  return <img style={style} onClick={onClick} src={icon} alt="sorting img" />;
};

export default AscendingDescendingImg;
