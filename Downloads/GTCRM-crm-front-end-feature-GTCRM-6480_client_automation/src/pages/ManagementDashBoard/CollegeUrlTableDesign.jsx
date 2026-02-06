import React from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "../../styles/managementDashboard.css";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
const CollegeUrlTableDesign = ({ headerText, urlList }) => {
  const [textToCopy, setTextToCopy] = React.useState("");
  const handleUrlCopy = (urlCopy) => {
    navigator.clipboard.writeText(urlCopy);
    setTimeout(() => {
      setTextToCopy("");
    }, 1500);
  };
  return (
    <>
      <TableContainer
        component={Paper}
        className="custom-scrollbar"
        sx={{ boxShadow: 0 }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: "#FFF" }}>
            <TableRow sx={{ borderBottom: "1px solid #EEE" }}>
              <TableCell align={"left"} sx={{ fontWeight: "600" }}>
                <Typography className="college-live-student-url-text">
                  {headerText}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {urlList?.length > 0 ? (
                  <>
                    {urlList?.map((item) => {
                      return (
                        <FormControl
                          focused={true}
                          variant="outlined"
                          color="info"
                          sx={{ mt: 2, width: "100%" }}
                        >
                          <InputLabel htmlFor="outlined-adornment-password">
                            File URL
                          </InputLabel>
                          <OutlinedInput
                            info="true"
                            type="text"
                            style={{ color: "#008BE2" }}
                            size="small"
                            value={item}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="copy url" edge="end">
                                  {item !== textToCopy ? (
                                    <ContentPasteOutlinedIcon
                                      color="info"
                                      sx={{ fontSize: 20 }}
                                      onClick={() => {
                                        handleUrlCopy(item);
                                        setTextToCopy(item);
                                      }}
                                    />
                                  ) : (
                                    <CheckOutlinedIcon
                                      sx={{ fontSize: 20 }}
                                      color="info"
                                    />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                          />
                        </FormControl>
                      );
                    })}
                  </>
                ) : (
                  <Box className="url-not-available-box">
                    <Typography className="url-not-available-text">
                      URLs will be available after approval.
                    </Typography>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CollegeUrlTableDesign;
