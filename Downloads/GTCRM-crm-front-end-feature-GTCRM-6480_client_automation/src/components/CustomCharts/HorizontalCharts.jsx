import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// const data = [
//     { plotName: "Friends", value: 50, color: "blue" },
//     { plotName: "Sister", value: 25, color: "green" },
//     { plotName: "Brother", value: 25, color: "red" },
//   ];
const HorizontalCharts = ({ data }) => {
  const totalValues = useMemo(() => {
    return data.reduce((total, plotName) => total + plotName.value, 0);
  }, [data]);

  const BAR_HEIGHT = 13;

  const [hoveredPlotName, setHoveredPlotName] = useState(null);
  const [gapFromLeft, setGapFromLeft] = useState(0);

  const handlePlotNameHover = (index) => {
    setHoveredPlotName(index);
  };

  const handlePlotNameLeave = () => {
    setHoveredPlotName(null);
    setGapFromLeft(0);
  };

  const navigate = useNavigate();
  const hyperLinkPermission = useSelector(
    (state) =>
      state?.authentication?.permissions?.menus?.dashboard?.admin_dashboard
        ?.features?.hyper_link
  );
  const hyperLinkCounselorPermission = useSelector(
    (state) =>
      state?.authentication?.permissions?.menus?.dashboard?.counselor_dashboard?.features?.hyper_link
  );

  useEffect(() => {
    if (hoveredPlotName !== 0) {
      const hoveredText = document.getElementById(
        `horizontal-chart-hover-text-${hoveredPlotName}`
      );
      // we are detecting the overflow of the content and calculating the left gap
      if (hoveredText?.scrollWidth > hoveredText?.clientWidth) {
        setGapFromLeft(hoveredText?.scrollWidth - hoveredText?.clientWidth);
      }
    }
  }, [hoveredPlotName]);

  return (
    <div>
      <div style={{ width: "100%", height: `${BAR_HEIGHT}px` }}>
        {data.map((plotName, index) => (
          <>
            {plotName.value > 0 && (
              <div
                key={index}
                style={{
                  width: `${(plotName.value / totalValues) * 100}%`,
                  height: "100%",
                  backgroundColor: plotName.color,
                  float: "left",
                  borderTopLeftRadius: index === 0 && "3px",
                  borderBottomLeftRadius: index === 0 && "3px",
                  borderTopRightRadius: index === data.length - 1 && "3px",
                  borderBottomRightRadius: index === data.length - 1 && "3px",
                }}
                onMouseEnter={() => {
                  handlePlotNameHover(index);
                }}
                onMouseLeave={handlePlotNameLeave}
              />
            )}
          </>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        {data.map((plotName, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              float: "left",
              width: `${(plotName.value / totalValues) * 100}%`,
              marginTop: "8px",
              textAlign:
                index === 0
                  ? "start"
                  : index === data.length - 1
                  ? "end"
                  : "start",
              color: plotName.color,
              fontSize: "13px",
            }}
          >
            {plotName.value > 0 && (
              <span
                onClick={() => {
                  if (hyperLinkPermission || hyperLinkCounselorPermission)
                    if (plotName?.navigate) {
                      navigate(plotName?.navigate, {
                        state: plotName?.navigateState,
                      });
                    }
                }}
                style={{ cursor: plotName?.navigate ? "pointer" : "" }}
                className="interview-list-vertical-number-value"
              >
                {plotName.value}{" "}
              </span>
            )}
            {hoveredPlotName === index && (
              <p
                id={`horizontal-chart-hover-text-${index}`}
                className="shared-horizontal-chart-hover-text"
                style={{
                  left: hoveredPlotName === 0 ? 0 : `-${gapFromLeft}px`,
                }}
              >
                {plotName.plotName}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCharts;
