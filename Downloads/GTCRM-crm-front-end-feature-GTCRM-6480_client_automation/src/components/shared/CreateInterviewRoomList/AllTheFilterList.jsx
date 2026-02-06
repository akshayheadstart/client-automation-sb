import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import MultipleFilterSelectionInterviewModule from "./CreateInterviewFilter";
import { SelectPicker } from "rsuite";

const AllTheFiltersList = ({
  filterData,
  clickedFilterIcon,
  setPageNumber,
  setThePayload,
  setPickTop,
}) => {
  return (
    <Box className="create-interview-filter-container">
      <Grid container spacing={3}>
        {filterData.map((data) => (
          <>
            {!data?.hide && (
              <Grid item md={3} sm={6} xs={12}>
                {data?.single ? (
                  <SelectPicker
                    data={data.data}
                    placeholder={data.placeholder}
                    className="create-interview-filter"
                    size="lg"
                    value={data.value}
                    onChange={data.setValue}
                    placement="auto"
                  />
                ) : (
                  <MultipleFilterSelectionInterviewModule
                    data={data.data}
                    placeholder={data.placeholder}
                    className="create-interview-filter"
                    size="lg"
                    value={data.value}
                    setValue={data.setValue}
                    placement="auto"
                    loading={data?.loading}
                    onOpen={data?.onOpen}
                    groupBy={data?.groupBy}
                    onClose={data?.onClose}
                  />
                )}
              </Grid>
            )}
          </>
        ))}
        <Grid item md={4} sm={6} xs={12}>
          {clickedFilterIcon ? (
            <Box className="apply-interview-filter">
              <button type="submit">Apply Filter</button>
            </Box>
          ) : (
            <Box className="create-interview-action">
              <button type="submit">Create List</button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllTheFiltersList;
