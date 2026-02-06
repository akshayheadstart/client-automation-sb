import {
  Box,
  ClickAwayListener,
  FormHelperText,
  Typography,
} from "@mui/material";
import React from "react";
import { Input, InputGroup } from "rsuite";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.grey,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.grey,
  },
}));

export default function WeightageAndParameter({
  parameterItems,
  totalWeightageCondition,
  handleWeightageChange,
  setParameterFieldWarning,
  parameterFieldWarning,
  setOpenCreateParameterDialog,
  setGdOrPiBtnClicked,
  totalWeightage,
  from,
}) {
  const [clickedItemIndex, setClickedItemIndex] = useState("");
  const [editParameterName, setEditGdParameterName] = useState(false);

  const handleItemDoubleClick = (index) => {
    setClickedItemIndex(index);
    setEditGdParameterName(true);
  };

  const handleWeightageOnBlur = () => {
    setEditGdParameterName(false);
  };

  return (
    <Box className="create-selection-param-weightage-box">
      {parameterItems?.map((item, index) => (
        <Box>
          <Box key={item?.id} sx={{ display: "flex" }}>
            <InputGroup
              inside
              className={`${
                totalWeightageCondition &&
                "create-selection-weightage-input-group-error"
              } create-selection-weightage-input-group`}
            >
              <Input
                required
                type="number"
                defaultValue={item?.weightage_value}
                value={item?.weightage_value}
                className="create-selection-weightage-box"
                onWheel={(e) => e.target.blur()}
                onChange={(value) => {
                  if (value === "" || (value > 0 && value <= 100)) {
                    handleWeightageChange(index, value, item?.parameter_name);
                  }
                }}
              />
              <InputGroup.Addon>%</InputGroup.Addon>
            </InputGroup>

            <Box
              onDoubleClick={() => handleItemDoubleClick(index)}
              className="create-selection-parameter-box"
            >
              <BootstrapTooltip title="Double click to edit" placement="top">
                {editParameterName && clickedItemIndex === index ? (
                  <ClickAwayListener
                    onClickAway={() => {
                      handleWeightageOnBlur();
                    }}
                  >
                    <Input
                      style={{ width: "140px" }}
                      required
                      type="text"
                      defaultValue={item?.parameter_name}
                      value={item?.parameter_name}
                      className="create-selection-weightage-box"
                      onChange={(value) => {
                        setParameterFieldWarning("");
                        handleWeightageChange(
                          index,
                          item?.weightage_value,
                          value
                        );
                      }}
                      onBlur={(e) => {
                        if (e?.target?.value) {
                          handleWeightageOnBlur();
                          setParameterFieldWarning("");
                        } else {
                          setParameterFieldWarning("Please enter parameter");
                        }
                      }}
                    />
                  </ClickAwayListener>
                ) : (
                  <Typography variant="body2">
                    {item?.parameter_name}
                  </Typography>
                )}
              </BootstrapTooltip>
              {index !== 0 && (
                <DeleteIcon
                  onClick={() => handleWeightageChange(index)}
                  sx={{ cursor: "pointer", fontSize: "14px" }}
                />
              )}
            </Box>
          </Box>
          <Box>
            {parameterFieldWarning && clickedItemIndex === index && (
              <FormHelperText sx={{ color: "#ffa117" }} variant="subtitle1">
                {parameterFieldWarning}
              </FormHelperText>
            )}
          </Box>
        </Box>
      ))}

      {parameterItems?.length < 10 && (
        <button
          onClick={() => {
            setOpenCreateParameterDialog(true);
            setGdOrPiBtnClicked(from);
          }}
          className="create-selection-plus-btn"
          type="button"
        >
          +
        </button>
      )}

      {totalWeightageCondition && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormHelperText sx={{ color: "#ffa117" }} variant="subtitle1">
            Total weightage must be 100
          </FormHelperText>
          <Typography sx={{ color: "#ffa117" }} variant="body2">
            ({totalWeightage} | 100)
          </Typography>
        </Box>
      )}
    </Box>
  );
}
