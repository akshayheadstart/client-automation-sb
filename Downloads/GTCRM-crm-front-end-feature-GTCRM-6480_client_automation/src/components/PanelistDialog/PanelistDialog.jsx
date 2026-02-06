import { Box, Card, CircularProgress, Slider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/system/Unstable_Grid/Grid";
import React from "react";
import "../../styles/PanelistDialog.css";
import "../../styles/PanellistDesignPage.css";
import "../../styles/MODDesignPage.css";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  calculateOverallRating,
  removeUnderlineAndJoin,
} from "../../helperFunctions/calendarHelperfunction";
const PanelistDialog = ({
  handleClose,
  open,
  scores,
  setStudentInfo,
  status,
  apiResponseChangeMessage,
  handleMarksSubmit,
  submitMarksInternalServerError,
  somethingWentWrongInSubmitMarks,
  dataSet,
  loading,
  findIndexInfo,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const themes = createTheme({
    components: {
      MuiSlider: {
        styleOverrides: {
          thumb: {
            "&:before": {
              backgroundColor: "#33A3E6",
            },
          },
          rail: {
            backgroundColor: "#33A3E6",
          },
          track: {
            backgroundColor: "#33A3E6",
          },
          mark: {
            backgroundColor: "#33A3E6",
          },
        },
      },
    },
  });

  const overallRating = calculateOverallRating(scores, dataSet);
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {submitMarksInternalServerError || somethingWentWrongInSubmitMarks ? (
          <>
            {submitMarksInternalServerError && (
              <Error500Animation height={500} width={400}></Error500Animation>
            )}
            {somethingWentWrongInSubmitMarks && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <>
            <DialogContent>
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress value={30} color="info" />
                </Box>
              )}
              <Box>
                <Typography sx={{ color: "black" }}>
                  <Typography sx={{ fontSize: "22px" }}>
                    following are the rating given{" "}
                  </Typography>
                  <Typography className="dialog-text-data">
                    <Typography sx={{ fontSize: "22px" }}>
                      to the applicant : {findIndexInfo?.name} Is{" "}
                    </Typography>
                    <Typography sx={{ fontSize: "22px", color: "#039BDC" }}>
                      {status ? status : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography sx={{ fontSize: "13px", mt: 3 }}>
                    Applied For: {dataSet?.course_Name} in{" "}
                    {dataSet?.specialization_name}
                  </Typography>
                </Typography>
                <Box sx={{ m: 2, pt: 5 }}>
                  <Grid container spacing={2}>
                    {dataSet?.marking_scheme?.map((marks, index) => {
                      return (
                        <Grid item xs={12} sm={12} md={4}>
                          <Box sx={{ position: "relative" }}>
                            <Typography
                              sx={{ right: 8, mt: -1.1 }}
                              className="dialog-text-weightage-data"
                            >
                              {marks?.weight}%
                            </Typography>

                            <Card className="card-maxWidth-container-dialog">
                              <Box className="dialog-box-flex">
                                <Typography className="dialog-text-info-data">
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {removeUnderlineAndJoin(marks?.name)}:
                                  </Typography>
                                  <Typography
                                    sx={{ fontWeight: 800, fontSize: "10px" }}
                                  >
                                    {scores[index].point}
                                  </Typography>
                                </Typography>
                              </Box>
                              <ThemeProvider theme={themes}>
                                <Slider
                                  valueLabelDisplay="auto"
                                  aria-label="pretto slider"
                                  defaultValue={scores[index].point}
                                  max={10}
                                  min={0.5}
                                  step={0.5}
                                  disabled
                                />
                              </ThemeProvider>
                            </Card>
                          </Box>
                        </Grid>
                      );
                    })}
                    <Grid item xs={12} sm={12} md={4}>
                      <Box sx={{ position: "relative" }}>
                        <Card className="card-maxWidth-container-dialog">
                          <Box className="dialog-box-flex">
                            <Typography>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                  fontWeight: 600,
                                }}
                              >
                                Over All Rating
                              </Typography>
                              <Typography
                                sx={{ fontWeight: 800, fontSize: "13px" }}
                              >
                                {overallRating ? overallRating.toFixed(2) : "0"}
                                /10
                              </Typography>
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </DialogContent>
            <Box className="unAssignee-button-design-container">
              <Button
                size="small"
                sx={{
                  borderRadius: 30,
                  paddingX: 3,
                  bgcolor: "white",
                  color: "#008BE2",
                  border: "1px solid #008BE2",
                }}
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: 30, paddingX: 3 }}
                color="info"
                onClick={() => {
                  handleMarksSubmit();
                }}
              >
                Submit
              </Button>
            </Box>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default PanelistDialog;
