import React, { useState } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
} from "@mui/material";

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function SelectType(props) {
  const { labelText } = props;

  const [collegeName, setCollegeName] = useState();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCollegeName(value);
  };

  return (
    <div>
      <FormControl sx={{ mt: 3, width: "100%" }}>
        <InputLabel id="uploadDoc" sx={{ backgroundColor: "#ffffff" }}>
          {labelText}
        </InputLabel>
        <Select
          labelId="uploadDoc"
          id="courseName"
          value={collegeName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectType;
