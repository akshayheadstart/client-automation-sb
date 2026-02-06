import React, { useEffect } from "react";
import "../../../styles/ToggleButton.css";
import { Box, Typography } from "@mui/material";

const ToggleSwitch = ({
  filterBlocks,
  setFilterBlocks,
  blockId,
  from,
  localStorageKey,
  preview,
}) => {
  const conditionKey =
    from === "conditionBetweenBlock"
      ? "conditionBetweenBlock"
      : "blockCondition";

  const handleToggle = () => {
    setFilterBlocks((prevFilterBlocks) =>
      prevFilterBlocks.map((block) => {
        if (block.id === blockId) {
          const updatedOption = block[conditionKey] === "OR" ? "AND" : "OR";
          return {
            ...block,
            [conditionKey]: updatedOption,
            color:
              updatedOption === "AND"
                ? "#039bdc !important"
                : "#0FABBD !important",
          };
        }
        return block;
      })
    );
  };

  const matchedBlockCondition = filterBlocks?.find(
    (block) => block?.id === blockId
  )?.[conditionKey];

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(filterBlocks));
  }, [filterBlocks, localStorageKey]);

  return (
    <>
      <Box
        className={`${
          matchedBlockCondition === "OR"
            ? "toggle-switch-or-box"
            : "toggle-switch-box"
        }`}
      >
        <Box className="and-or-wrapper">
          <Typography
            sx={{
              color: matchedBlockCondition === "AND" && "#039bdc !important",
            }}
            className={`toggle-text ${
              matchedBlockCondition === "AND" ? "toggle-thumb" : ""
            }`}
            onClick={() => {
              !preview && handleToggle();
            }}
          >
            AND
          </Typography>
          <Typography
            sx={{
              color: matchedBlockCondition === "OR" && "#0FABBD !important",
            }}
            className={`toggle-text ${
              matchedBlockCondition === "OR" ? "toggle-thumb" : ""
            }`}
            onClick={() => {
              !preview && handleToggle();
            }}
          >
            OR
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ToggleSwitch;
