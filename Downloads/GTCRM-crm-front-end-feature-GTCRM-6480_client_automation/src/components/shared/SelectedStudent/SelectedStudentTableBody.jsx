import { TableCell } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SelectedStudentTableBody = ({ data,interviewListId }) => {
  const navigate =useNavigate()
  return (
    <>
      <TableCell onClick={()=>navigate('/student-profile',{state:{application_id:data.application_id,interviewListId:interviewListId}})} sx={{cursor:'pointer',textDecoration:'underline',color:'#3498db'}}  align="center">{data.student_name}</TableCell>
      <TableCell align="center">
        {data.custom_application_id || data?.application_number}
      </TableCell>
      <TableCell align="center">
        {data.twelve_marks ? data?.twelve_marks : "NA"}
      </TableCell>
      <TableCell align="center">
        {data.ug_marks ? data?.ug_marks : "NA"}
      </TableCell>
      <TableCell align="center">
        {data.interview_marks ? data?.interview_marks : "NA"}
      </TableCell>
    </>
  );
};

export default React.memo(SelectedStudentTableBody);
