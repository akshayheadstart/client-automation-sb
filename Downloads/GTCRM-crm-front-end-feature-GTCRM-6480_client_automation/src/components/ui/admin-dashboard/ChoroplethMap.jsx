import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";
import "../../../styles/choroplethmap.css";
import { Box, Typography } from "@mui/material";

import INDIA_TOPO_JSON from "./india.topo.json";

const PROJECTION_CONFIG = {
  scale: 400,
  center: [88.9629, 21.1937], // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  "#11F0FF",
  "#0FCFF7",
  "#0EBFE9",
  "#11bed2",
  "#0d9ec0",
  "#0a7eae",
  "#036cb6",
];

const DEFAULT_COLOR = "#a7f1fa";

const geographyStyle = {
  default: { outline: "none" },
  hover: {
    fill: "#241461",
    transition: "all 250ms",
    // stroke: "#EAEAEC",
    // strokeWidth: "0.5px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    outline: "none",
  },
};

const ChoroplethMap = (props) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const { mapData, tabsCurrentValue } = props;

  const [mapDataCopy, setMapDataCopy] = useState([...mapData]);
  const [mapTitle, setMapTitle] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  useEffect(() => {
    let copyMapData = [...mapData];
    if (tabsCurrentValue === 0) {
      copyMapData.sort((a, b) => b?.total_lead - a?.total_lead);
    } else {
      copyMapData.sort((a, b) => b?.application_count - a?.application_count);
    }

    setMapDataCopy(copyMapData);
  }, [tabsCurrentValue, mapData]);

  const colorScale =
    tabsCurrentValue === 0
      ? scaleQuantile()
          .domain(mapDataCopy.map((d) => d.total_lead))
          .range(COLOR_RANGE)
      : scaleQuantile()
          .domain(mapDataCopy.map((d) => d.application_count))
          .range(COLOR_RANGE);

  const onMouseEnter = (
    geo,
    current = tabsCurrentValue === 0
      ? { total_lead: "0", lead_percentage: "0", application_percentage: "0" }
      : {
          application_count: "0",
          lead_percentage: "0",
          application_percentage: "0",
        }
  ) => {
    return () => {
      setTooltipContent(
        `${geo.properties.name}: ${
          tabsCurrentValue === 0
            ? current.total_lead
            : current.application_count
        }`
      );

      setMapTitle(
        geo.properties.name?.length > 15
          ? `${geo.properties.name.slice(0, 15)}..`
          : geo.properties.name
      );
      setMapDescription(
        `${
          tabsCurrentValue === 0
            ? `${current?.total_lead} (${Number(
                current?.lead_percentage
              ).toFixed(2)}%)`
            : `${current?.application_count} (${Number(
                current?.application_percentage
              ).toFixed(2)}%)`
        }`
      );
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
    setMapTitle("");
    setMapDescription("");
  };
  return (
    <>
      {
        <div className="full-width-height container">
          <ReactTooltip>{tooltipContent}</ReactTooltip>
          <ComposableMap
            projectionConfig={PROJECTION_CONFIG}
            projection="geoMercator"
            width={300}
            height={230}
            data-tip=""
          >
            <Geographies geography={INDIA_TOPO_JSON}>
              {({ geographies }) =>
                geographies.map((geo, index) => {
                  const current = mapDataCopy.find(
                    (s) => s.state_code === geo.id
                  );

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={
                        current
                          ? tabsCurrentValue === 0
                            ? current.total_lead !== 0
                              ? colorScale(current.total_lead)
                              : "#a7f1fa"
                            : current.application_count !== 0
                            ? colorScale(current.application_count)
                            : "#a7f1fa"
                          : DEFAULT_COLOR
                      }
                      style={{
                        ...geographyStyle,
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",

                        hover: { fill: "#04D", outline: "none" },
                        pressed: { fill: "#02A", outline: "none" },
                      }}
                      onMouseEnter={onMouseEnter(geo, current)}
                      onMouseLeave={onMouseLeave}
                      stroke={current && "#231f20"}
                      strokeWidth={current && "0.1px"}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          {/* {mapDataCopy[0]?.total_lead > 0 && ( */}
          <Box className="maps-maximum-city-text">
            <Typography className="maps-maximum-title">{mapTitle}</Typography>
            <Typography className="maps-maximum-descrip">
              {mapDescription}
            </Typography>
          </Box>
          {/* )} */}
        </div>
      }
    </>
  );
};

export default React.memo(ChoroplethMap);
