import React from "react";
import { IconButton, Skeleton } from "@mui/material";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "../../icons/edit-icon.svg";

import "../../styles/ManageCourses.css";
import "../../styles/sharedStyles.css";

const SpecializationList = ({
  courseData = {},
  handleEditBtnClick = () => {},
  loading,
}) => {
  const renderLoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant="rectangular" />
      </TableCell>
      <TableCell>
        <Skeleton variant="rectangular" />
      </TableCell>
      <TableCell>
        <Skeleton variant="rectangular" />
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer component={Paper} className="custom-scrollbar">
      <Table>
        <TableHead className="specialization-table-head">
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell width={"10%"}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courseData && courseData.course_specialization
            ? courseData.course_specialization.map((item) => {
                return loading ? (
                  renderLoadingSkeleton()
                ) : (
                  <TableRow>
                    <TableCell>
                      {item.spec_name === null
                        ? "No Specialization"
                        : item.spec_name}
                    </TableCell>
                    <TableCell align="center">
                      <span
                        className={`text-center ${
                          item.is_activated
                            ? "severityPill-success"
                            : "severityPill-failed"
                        }`}
                      >
                        {item.is_activated ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        data-testid="editBtn"
                        onClick={() => handleEditBtnClick(item)}
                        className="edit-btn"
                      >
                        <img src={EditIcon} alt="edit specialization" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpecializationList;
