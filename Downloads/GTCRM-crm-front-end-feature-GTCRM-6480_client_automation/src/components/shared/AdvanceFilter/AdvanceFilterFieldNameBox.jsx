import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdvanceFilterCategoryDialog from "./AdvanceFilterCategoryDialog";

const AdvanceFilterFieldNameBox = ({
  selectedValue,
  handleFilterOptionUpdate,
  index,
  blockId,
  advFilterCategoryList,
  selectedCategory,
  setSelectedCategory,
  selectedCategoriesFields,
  advFilterCategoryInternalServerError,
  advFilterCategorySomethingWentWrong,
  avFilterCategorySearchText,
  setAvFilterCategorySearchText,
  loadingAdvFilterCategories,
  preview,
}) => {
  const [openAdvFilterCategoryDialog, setOpenAdvFilterCategoryDialog] =
    useState(false);

  return (
    <>
      <Box
        className="adv-filter-field-name-box"
        onClick={() => {
          !preview && setOpenAdvFilterCategoryDialog(true);
        }}
      >
        <Typography>{selectedValue ? selectedValue : "Field Name"}</Typography>

        <KeyboardArrowDownIcon
          sx={{
            cursor: "pointer",
            visibility: selectedValue ? "hidden" : "visible",
          }}
        />
      </Box>
      {openAdvFilterCategoryDialog && (
        <AdvanceFilterCategoryDialog
          openAdvFilterCategoryDialog={openAdvFilterCategoryDialog}
          setOpenAdvFilterCategoryDialog={setOpenAdvFilterCategoryDialog}
          handleFilterOptionUpdate={handleFilterOptionUpdate}
          index={index}
          blockId={blockId}
          advFilterCategoryList={advFilterCategoryList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCategoriesFields={selectedCategoriesFields}
          advFilterCategoryInternalServerError={
            advFilterCategoryInternalServerError
          }
          advFilterCategorySomethingWentWrong={
            advFilterCategorySomethingWentWrong
          }
          avFilterCategorySearchText={avFilterCategorySearchText}
          setAvFilterCategorySearchText={setAvFilterCategorySearchText}
          loadingAdvFilterCategories={loadingAdvFilterCategories}
        />
      )}
    </>
  );
};

export default AdvanceFilterFieldNameBox;
