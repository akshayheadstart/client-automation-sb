import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import "../../../styles/sharedStyles.css";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import ErrorIcon from "@mui/icons-material/Error";
import { Popover, Whisper } from "rsuite";
import LeefLottieAnimationLoader from "../Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../Loader/BaseNotFoundLottieLoader";

const AdvanceFilterCategoryDialog = ({
  openAdvFilterCategoryDialog,
  setOpenAdvFilterCategoryDialog,
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
}) => {
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  const handleCloseDialog = () => {
    setOpenAdvFilterCategoryDialog(false);
  };

  const speaker = (title) => {
    return (
      <Popover style={{ zIndex: 2000 }}>
        <p>{title}</p>
      </Popover>
    );
  };

  return (
    <Dialog
      maxWidth={"md"}
      open={openAdvFilterCategoryDialog}
      onClose={handleCloseDialog}
    >
      {advFilterCategoryInternalServerError ||
      advFilterCategorySomethingWentWrong ? (
        <>
          {advFilterCategoryInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {advFilterCategorySomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <Box className="advance-filter-category-box-background">
          <DialogTitle>
            <Box>
              <TextField
                className="adv-filter-category-dialog-search-box"
                value={avFilterCategorySearchText}
                onChange={(event) => {
                  setAvFilterCategorySearchText(event.target.value);
                }}
                color="info"
                placeholder="Search"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#008BE2" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton sx={{ ml: 2 }}>
                <CloseIcon onClick={handleCloseDialog} />
              </IconButton>
            </Box>
          </DialogTitle>

          {loadingAdvFilterCategories ? (
            <Box className="adv-filter-loading-animation">
              <LeefLottieAnimationLoader
                height={90}
                width={100}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <DialogContent>
              {advFilterCategoryList?.length > 0 &&
              selectedCategoriesFields?.length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Typography className="avd-filter-select-category-text">
                      Select Category
                    </Typography>
                    {advFilterCategoryList?.map((category, index) => (
                      <Box
                        key={index}
                        className={
                          category === selectedCategory
                            ? "avd-filter-category-box-active"
                            : "avd-filter-category-box"
                        }
                        onClick={() => {
                          setSelectedCategory(category);
                        }}
                      >
                        <Typography
                          className={
                            category === selectedCategory
                              ? "avd-filter-category-name-active"
                              : "avd-filter-category-name"
                          }
                        >
                          {category}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item md={1}>
                    <Divider orientation="vertical" />
                  </Grid>
                  <Grid item md={7}>
                    <Box
                      className={
                        selectedCategoriesFields?.length > 10 &&
                        "vertical-scrollbar-adv-filter"
                      }
                    >
                      <Typography
                        sx={{ mb: "15px", padding: "8px 0px" }}
                        className="avd-filter-category-name"
                      >
                        {selectedCategory} Fields
                      </Typography>
                      {selectedCategoriesFields?.map((field) => (
                        <Box
                          key={field?.field_name}
                          className="adv-filter-category-field-box"
                        >
                          {field?.show !== false && (
                            <>
                              <Typography
                                onClick={() => {
                                  handleFilterOptionUpdate(
                                    "field-name",
                                    field?.field_name,
                                    index,
                                    blockId,
                                    field?.field_type,
                                    field?.dependent_fields,
                                    field?.collection_field_name,
                                    field?.collection_name
                                  );

                                  handleCloseDialog();

                                  handleFilterOptionUpdate(
                                    "operator",
                                    "",
                                    index,
                                    blockId
                                  );

                                  handleFilterOptionUpdate(
                                    "operator-list",
                                    field?.operators,
                                    index,
                                    blockId
                                  );

                                  handleFilterOptionUpdate(
                                    "value-list",
                                    field?.select_option_function
                                      ? field?.select_option_function
                                      : field?.field_name === "Country"
                                      ? field?.select_option?.map((value) => {
                                          return { label: value, value: "IN" };
                                        })
                                      : field?.select_option?.map((value) => {
                                          return { label: value, value: value };
                                        }),
                                    index,
                                    blockId,
                                    field?.field_type,
                                    field?.dependent_fields
                                  );

                                  if (field?.alert) {
                                    handleFilterOptionUpdate(
                                      "alert",
                                      field?.alert,
                                      index,
                                      blockId,
                                      field?.field_type,
                                      field?.dependent_fields
                                    );
                                  }
                                }}
                                className="avd-filter-category-name"
                                sx={{
                                  color: "#000 !important",
                                  cursor: "pointer",
                                }}
                              >
                                {field?.field_name}
                              </Typography>
                              {field?.alert && (
                                <Whisper
                                  placement="right"
                                  trigger="hover"
                                  controlId="control-id-hover"
                                  speaker={speaker(field?.alert)}
                                >
                                  <ErrorIcon />
                                </Whisper>
                              )}
                            </>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "30vh",
                    alignItems: "center",
                  }}
                  data-testid="not-found-animation-container"
                >
                  <BaseNotFoundLottieLoader
                    height={300}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </DialogContent>
          )}
        </Box>
      )}
    </Dialog>
  );
};

export default AdvanceFilterCategoryDialog;
