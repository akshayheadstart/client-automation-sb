import { TableCell, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import IndicatorComponent from "./IndicatorComponent";

const TopPerformingChannelTableCell = (props) => {
  const {
    indicatorTitle,
    indicator,
    dataCount,
    dataCountPercentage,
    dataCountPercentagePosition,
    dataCountPercentageDifference,
    color,
    handleNavigate,
  } = props;

  return (
    <TableCell align="center" sx={{ borderColor: "#E6E8F0" }}>
      <Box className="top-performing-table-box">
        <Typography
          onClick={() => handleNavigate && handleNavigate()}
          sx={{ cursor: "pointer" }}
          color={color}
          variant="subtitle2"
          className="top-performing-table-box-value"
        >
          {dataCount ? dataCount : 0}
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className="top-performing-table-box-percentage"
        >
          (
          {dataCountPercentage
            ? Math.round(dataCountPercentage * 100) / 100
            : 0}
          )%
        </Typography>
        <Box sx={{ marginBottom: "-4px" }}>
          <IndicatorComponent
            indicator={indicator}
            fontSize={12}
            indicatorSize={14}
            title={indicatorTitle}
            performance={dataCountPercentagePosition || "equal"}
            percentage={parseFloat(
              dataCountPercentageDifference ? dataCountPercentageDifference : 0
            ).toFixed(2)}
            tooltipPosition="right"
          ></IndicatorComponent>
        </Box>
      </Box>
    </TableCell>
  );
};

export default TopPerformingChannelTableCell;
