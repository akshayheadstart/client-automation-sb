/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Card, Grid, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import "../../styles/dialogEvent.css";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import "../../styles/documentLocker.css";
import "../../styles/newtimeline.css";
import CloseIcon from "@mui/icons-material/Close";
import '../../styles/sharedStyles.css'
import counselorAvatarIcon from '../../images/counselorIcon.png'
import systemIcon from '../../images/systemIcon.png'
import userAvatarIcon from '../../images/studentIcon.png'
import { documentCommentList } from "../../constants/LeadStageList";
const DocumentLockerCommentDialog = ({
  handleClickCommentDialogClose,
  open,
  commentDescription,
  setCommentDescription,
  somethingWentWrongInStudent,
  updateApiInternalServerError,
  apiResponseChangeMessage,
  allComment,
  commentsApiInternalServerError,
  somethingWentWrongComments,
  handleUpdateDocumentComment,
  setAllComment,
  isScrolledComment,
}) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  let commentDescriptionLength = commentDescription?.length;
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => {
          handleClickCommentDialogClose();
          setAllComment([]);
        }}
        aria-labelledby="responsive-dialog-title"
        className="change-dialog-box-container"
      >
        <Box className="comment-dialog-headline-box-container">
          <Typography className="comment-dialog-headline-text">
            Document Remarks
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              handleClickCommentDialogClose();
              setCommentDescription("");
              setAllComment([]);
            }}
          />
        </Box>
        <DialogContent className="vertical-scrollbar">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Box sx={{ paddingLeft: 0 }}>
                  <TextField
                    sx={{ mt: 2 }}
                    required
                    color="info"
                    fullWidth
                    placeholder="Typing remarks..."
                    id="outlined-controlled"
                    multiline
                    rows={4}
                    value={commentDescription}
                    onChange={(e) => {
                        setCommentDescription(e.target.value);
                     
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box className="comment-dialog-default-message-box">
            {documentCommentList?.map((item,index) => {
              return (
                <Box
                  onClick={() => setCommentDescription(item)}
                  sx={{ borderRadius: 50, cursor: "pointer" }}
                  className="default-add-comment-box"
                  key={index}
                >
                  <Typography className="default-add-comment-box-text">
                   {item}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box className="event-button-container">
            <Button
              sx={{ borderRadius: 50 }}
              data-testid="cancelButtonModalDocumentComment"
              onClick={() => {
                handleClickCommentDialogClose();
                setCommentDescription("");
              }}
              variant="outlined"
              size="medium"
              color="info"
              className="cancel-button-design"
            >
              Cancel
            </Button>
            <Button
              sx={{ borderRadius: 50,height:'30px !important',fontSize:'12px !important' }}
              variant="contained"
              size="medium"
              type="submit"
              color="info"
              onClick={() => {
                handleClickCommentDialogClose();
                handleUpdateDocumentComment();
              }}
              disabled={commentDescriptionLength < 1}
              defaultValue={commentDescription}
            >
              Save
            </Button>
          </Box>
          <>
            {somethingWentWrongInStudent ||
            updateApiInternalServerError ||
            somethingWentWrongComments ||
            commentsApiInternalServerError ? (
              <>
                {(commentsApiInternalServerError ||
                  updateApiInternalServerError) && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {(somethingWentWrongComments ||
                  somethingWentWrongInStudent) && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </>
            ) : (
              <>
                <Grid container spacing={2}>
                  {isScrolledComment ? (
                    <>
                      <Grid item xs={12} sm={12} md={12}>
                        <Box className="loading-animation">
                          <LeefLottieAnimationLoader
                            height={100}
                            width={180}
                          ></LeefLottieAnimationLoader>
                        </Box>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{ pb: "20px", pl: "10px", mt: "20px" }}
                        className="timeline-box-container"
                      >
                        {allComment?.map((timeline, index) => {
                          return (
                            <>
                              <Card className="remarks-comment-message-card-design">
                                <Box>
                                  <Box
                                    className="timeline-user-icon-box"
                                    sx={{
                                      backgroundColor:
                                        timeline?.timeline_type === "Student"
                                          ? "rgba(4, 142, 224, 1)"
                                          : timeline?.timeline_type ===
                                            "Counselor"
                                          ? "rgba(0, 88, 143, 1)"
                                          : "rgba(17, 190, 210, 1)",
                                    }}
                                  >
                                    {timeline?.timeline_type === "Student" && (
                                      <img src={userAvatarIcon} />
                                    )}
                                    {timeline?.timeline_type ===
                                      "Counselor" && (
                                      <img src={counselorAvatarIcon} />
                                    )}
                                    {timeline?.timeline_type === "System" && (
                                      <img src={systemIcon} />
                                    )}
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography className="timeline-date-time-text">
                                    {timeline?.timestamp}
                                  </Typography>
                                  <Typography className="timeline-message-text">
                                    {timeline?.message}
                                  </Typography>
                                </Box>
                              </Card>
                              {timeline.duration1 && (
                                <>
                                  <Box>
                                    <Box className="timeline-divider-design"></Box>
                                    <Box className="timeline-day-text-box">
                                      <Typography className="timeline-day-text-size">
                                        {timeline.duration1}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box className="timeline-divider-design"></Box>
                                </>
                              )}
                            </>
                          );
                        })}
                      </Box>
                    </>
                  )}
                </Grid>
              </>
            )}
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentLockerCommentDialog;
