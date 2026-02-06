import React from "react";

import "../../../styles/FunnelDesign.css";

const FunnelSection = ({
  height = 0,
  width = 0,
  className = "",
  path = null,
  value = 0,
  label = "",
  style= {}
}) => {
  return (
    <svg
      style={{
        ...style
      }}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`relative-position ${className}`}
    >
      {path}
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#fff"
        className="count"
      >
        {value}
      </text>
      <text
        x="50%"
        y="80%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#fff"
        className="label"
      >
        {label}
      </text>
    </svg>
  );
};

export default FunnelSection;
