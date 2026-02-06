import { Grid } from "@mui/material";
import React from "react";
import ListOfUsers from "./ListOfUsers";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";

const PanelistAndApplications = ({
  handleDragStart,
  panelistList,
  applicantsList,
  setHighlightedSlot,
  typeOfPanel,
  openReschedule,
  setSlotsPayload,
  slotsPayload,
  slots,
  setRowsPerPage,
  rowsPerPage,
  setPageNumber,
  pageNumber,
  totalApplicationsCount,
}) => {
  const handleSearchPanelist = (searchedText) => {
    setSlotsPayload((prev) => ({ ...prev, search_by_panelist: searchedText }));
  };
  const handleSearchApplicants = (searchedText) => {
    setSlotsPayload((prev) => ({ ...prev, search_by_applicant: searchedText }));
  };
  const handleSortApplicants = () => {
    setSlotsPayload((prev) => ({
      ...prev,
      sort_by_twelve_marks: prev.sort_by_twelve_marks ? false : true,
    }));
  };
  const {
    setApplicantSearchText,
    applicantSearchText,
    panelistSearchText,
    setPanelistSearchText,
  } = useContext(DashboradDataContext);

  return (
    <Grid container spacing={2}>
      {openReschedule && typeOfPanel ? null : (
        <Grid
          sx={{ order: typeOfPanel ? 2 : 1 }}
          item
          md={typeOfPanel ? 12 : 3}
          sm={12}
          xs={12}
        >
          <ListOfUsers
            lists={panelistList}
            handleDragStart={handleDragStart}
            setHighlightedSlot={setHighlightedSlot}
            md={typeOfPanel ? 4 : 12}
            sm={typeOfPanel ? 6 : 12}
            handleSearch={handleSearchPanelist}
            searchText={panelistSearchText}
            setSearchText={setPanelistSearchText}
            slots={slots}
            typeOfPanel={typeOfPanel}
          />
        </Grid>
      )}
      <Grid
        sx={{ order: typeOfPanel ? 1 : 2 }}
        item
        md={typeOfPanel ? 12 : 9}
        sm={12}
        xs={12}
      >
        <ListOfUsers
          md={4}
          sm={6}
          lists={applicantsList}
          handleDragStart={handleDragStart}
          setHighlightedSlot={setHighlightedSlot}
          applicants={true}
          handleSortApplicants={handleSortApplicants}
          sortingOrder={slotsPayload?.sort_by_twelve_marks}
          handleSearch={handleSearchApplicants}
          searchText={applicantSearchText}
          setSearchText={setApplicantSearchText}
          slots={slots}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={totalApplicationsCount}
          openReschedule={openReschedule}
        />
      </Grid>
    </Grid>
  );
};

export default PanelistAndApplications;
