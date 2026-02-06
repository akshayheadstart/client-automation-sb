import {
  ClickAwayListener,
  FormHelperText,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import UserImage from "../../icons/user-image.svg";
import SortAscendingIcon from "../../icons/sort-ascending.png";
import SortDescendingIcon from "../../icons/sort-descending.png";
import AscendingDescendingImg from "../../components/shared/SelectedStudent/AsendingDesendingImg";
import SearchInputBox from "../../components/shared/forms/SearchInputBox";
import SearchIconButton from "../../components/shared/forms/SearchIconButton";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
const ListOfUsers = ({
  lists,
  applicants,
  handleDragStart,
  setHighlightedSlot,
  md,
  sm,
  handleSortApplicants,
  sortingOrder,
  handleSearch,
  searchText,
  setSearchText,
  typeOfPanel,
  setRowsPerPage,
  rowsPerPage,
  setPageNumber,
  pageNumber,
  count,
  openReschedule,
}) => {
  const [clickedSearchButton, setClickedSearchButton] = useState(false);

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  useEffect(() => {
    if (!searchText) {
      handleSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <Box className="panelist-list-container">
      <Box className="panelist-heading-and-search">
        {!applicants && clickedSearchButton && !typeOfPanel ? null : (
          <Typography variant="h6">
            {" "}
            {applicants ? "Applicants" : "Panelist"}{" "}
          </Typography>
        )}
        {!openReschedule && (
          <Box
            sx={{
              display: "flex",
              alignItems: clickedSearchButton ? "flex-start" : "center",
              gap: 1.5,
            }}
          >
            {applicants && (
              <Box
                onClick={handleSortApplicants}
                className="search-box-container"
                sx={{ p: "2px 6px !important" }}
              >
                {/* <SortOutlinedIcon /> */}
                <AscendingDescendingImg
                  style={{
                    opacity: 0.8,
                    width: clickedSearchButton ? "30px" : "25px",
                    color: "red",
                  }}
                  icon={sortingOrder ? SortDescendingIcon : SortAscendingIcon}
                />
              </Box>
            )}
            <ClickAwayListener
              onClickAway={() => setClickedSearchButton(false)}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchText);
                }}
              >
                <Box>
                  {clickedSearchButton ? (
                    <>
                      <SearchInputBox
                        setSearchText={setSearchText}
                        searchText={searchText}
                        className={
                          clickedSearchButton
                            ? "applicant-search-box-in-planner-large"
                            : "applicant-search-box-in-planner-small"
                        }
                      />
                      <FormHelperText sx={{ color: "#FFB020" }}>
                        Please press Enter key
                      </FormHelperText>
                    </>
                  ) : (
                    <SearchIconButton
                      sx={{ py: 0.4, px: 0.6, border: "1px solid #a8c9a5" }}
                      setClickedSearchIcon={setClickedSearchButton}
                    />
                  )}
                </Box>
              </form>
            </ClickAwayListener>
          </Box>
        )}
      </Box>
      {lists?.length > 0 ? (
        <>
          <Grid
            sx={{ maxHeight: applicants ? "250px" : "306px" }}
            className="panelist-list-details"
            container
            spacing={2}
          >
            {lists?.map((list) => (
              <Grid
                key={list?._id || list?.application_id}
                draggable
                onDragStart={(e) => handleDragStart(e, list)}
                onDragEnd={() => setHighlightedSlot(null)}
                item
                md={md}
                sm={sm}
                xs={12}
                sx={{ cursor: "move" }}
              >
                <Box className="panelist-details-container">
                  <Box className="image">
                    <img src={UserImage} alt="Panelist" />
                  </Box>
                  <Box className="panelist-details">
                    <Box className="panelist-name-and-count">
                      <Typography variant="caption">
                        {list?.student_name || list?.name}
                      </Typography>
                      {/* <Typography variant="caption">{list.count}</Typography> */}
                    </Box>
                    <Typography className="user-role" variant="caption">
                      {list?.course_name || list?.designation || "NA"}
                    </Typography>
                    <Typography variant="caption">
                      {list?.twelve_score || list?.school_short || "NA"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {applicants && !openReschedule && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Pagination
                className="pagination-bar"
                currentPage={pageNumber}
                totalCount={count}
                pageSize={rowsPerPage}
                onPageChange={(page) =>
                  handleChangePage(page, "", setPageNumber)
                }
                count={Math.ceil(count / rowsPerPage)}
              />
              <AutoCompletePagination
                rowsPerPage={rowsPerPage}
                rowPerPageOptions={rowPerPageOptions}
                setRowsPerPageOptions={setRowsPerPageOptions}
                rowCount={count}
                page={pageNumber}
                setPage={setPageNumber}
                setRowsPerPage={setRowsPerPage}
              ></AutoCompletePagination>
            </Box>
          )}
        </>
      ) : (
        <Box>
          <BaseNotFoundLottieLoader
            noContainer={true}
            width={100}
            height={92}
          />
        </Box>
      )}
    </Box>
  );
};

export default ListOfUsers;
