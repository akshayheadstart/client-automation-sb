import { Box } from "@mui/material";
import React from "react";
import BootsrapTooltipWithAvatar from "../../../shared/Tooltip/BootsrapTooltipWithAvatar";
import sortAscendingIcon from "../../../../icons/sort-ascending.png";
import sortDescendingIcon from "../../../../icons/sort-descending.png";

const TableHeadCollumns = ({
  columnText,
  setTwelveScoreSort,
  sort,
  setSort,
  sortingLocalStorageKeyName,
}) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {columnText}
        {columnText === "12th Score" && (
          <>
            {sort === "asc" || sort === "default" ? (
              <Box
                sx={{
                  cursor: "pointer",
                  opacity: sort === "default" ? "0.3" : "1",
                }}
                onClick={() => {
                  if (sort === "default") {
                    localStorage.setItem(sortingLocalStorageKeyName, "asc");
                    setTwelveScoreSort(true);
                    setSort("asc");
                  } else if (sort === "asc") {
                    localStorage.setItem(sortingLocalStorageKeyName, "des");
                    setTwelveScoreSort(false);
                    setSort("des");
                  }
                }}
              >
                {" "}
                <BootsrapTooltipWithAvatar
                  placement="top"
                  title={
                    sort === "default" ? "Unsorted" : "Sorted as ascending"
                  }
                  iconImage={sortAscendingIcon}
                ></BootsrapTooltipWithAvatar>{" "}
              </Box>
            ) : (
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (sort === "des") {
                    localStorage.setItem(sortingLocalStorageKeyName, "default");
                    setTwelveScoreSort(null);
                    setSort("default");
                  }
                }}
              >
                {" "}
                <BootsrapTooltipWithAvatar
                  placement="top"
                  title="Sorted as descending"
                  iconImage={sortDescendingIcon}
                ></BootsrapTooltipWithAvatar>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default TableHeadCollumns;
