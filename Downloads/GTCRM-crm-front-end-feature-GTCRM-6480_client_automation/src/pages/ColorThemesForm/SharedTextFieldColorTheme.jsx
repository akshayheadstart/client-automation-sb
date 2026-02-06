import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomTooltip from "../../components/shared/Popover/Tooltip";

const SharedTextFieldColorTheme = ({ label, color, onChange,photo,description }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    onChange({
      target: { value: newColor },
    });
  };

  return (
    <Grid item md={3} xs={12} sx={{ mt: 2, position: "relative" }}>
      <TextField
        label={`${label?.charAt(0)?.toUpperCase() + label?.slice(1)} Color`}
        id="outlined-size-small"
        size="small"
        color="info"
        value={color}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* hidden native color input */}
                <input
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="color-themes-picker-design"
                />
                <CustomTooltip
                maxWidth={"400px"}
                  description={
                    <Box sx={{alignItems:"center"}}>
                      <Typography sx={{fontSize:"13px",textAlign:"justify",mb:1}}>{description}</Typography>
                      <img src={photo} alt="photo" srcset="" style={{ width: 300, height: 100 }}/>
                    </Box>
                  }
                  component={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  }
                />
              </Box>
            </InputAdornment>
          ),
        }}
        onChange={onChange}
        fullWidth
      />
    </Grid>
  );
};

export default SharedTextFieldColorTheme;
