import { Avatar, Box, Card, Grid, Skeleton, Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import useToasterHook from "../../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import AssignmentIcon from "@mui/icons-material/Assignment";
import "./Navbar.css";
import { useSelector } from "react-redux";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";

const SearchBox = ({ setShowSearchBox, searchText, setSearchText }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const [searchResults, setSearchResults] = useState([]);
  const [isSearchResultsLoading, setIsSearchResultsLoading] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [somethingWentWrongInSearchApi, setSomethingWentWrongInSearchApi] =
    useState(false);
  const [searchApiInternalServerError, setSearchApiInternalServerError] =
    useState(false);

  const pageNumber = 1;
  const pageSize = 10;

  //getting search results
  useEffect(() => {
    setIsSearchResultsLoading(true);
    if (searchText?.length > 0) {
      fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/admin/search_students/?page_num=${pageNumber}&page_size=${pageSize}&search_input=${searchText}${
          collegeId ? "&college_id=" + collegeId : ""
        }&feature_key=608ac38c`,
        ApiCallHeaderAndBody(token, "GET")
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.detail) {
            setSearchResults([]);
            pushNotification("error", data.detail);
          } else if (data.data) {
            try {
              if (Array.isArray(data?.data)) {
                setSearchResults(data?.data);
              } else {
                throw new Error("search students API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInSearchApi,
                "",
                10000
              );
            }
          }
        })
        .catch(() => {
          handleInternalServerError(setSearchApiInternalServerError, "", 5000);
        })
        .finally(() => {
          setIsSearchResultsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, searchText, token]);
  const { headTitle } = useContext(LayoutSettingContext);
  return (
    <Card
      elevation={12}
      className="search-box"
      sx={{ mt: "15px", right: headTitle === "Admin Dashboard" ? "" : "10px" }}
    >
      <Box
        style={{ "overflow-y": "scroll" }}
        height="450px"
        className="vertical-scrollbar"
      >
        {searchApiInternalServerError || somethingWentWrongInSearchApi ? (
          <Box className="loading-animation-for-search">
            {searchApiInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInSearchApi && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <>
            {(isSearchResultsLoading
              ? Array.from(new Array(6))
              : searchResults
            )?.map((item, index) => (
              <Grid
                justifyContent="space-evenly"
                container
                spacing={2}
                sx={{
                  borderBottom:
                    index !== searchResults?.length - 1 &&
                    "0.5px solid rgba(22, 117, 224, 0.5)",
                  cursor: "pointer",
                  pt: 2,
                }}
                onClick={() => {
                  navigate("/userProfile", {
                    state: {
                      applicationId: item?.application_id,
                      studentId: item?.student_id,
                      eventType: "searched-lead",
                    },
                  });
                  setShowSearchBox(false);
                  setSearchText("");
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={3}
                  md={3}
                  sx={{
                    background:
                      "linear-gradient(121.26deg, #DBDAF0 -71.53%, rgba(219, 218, 240, 0) 127.98%)",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    py: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {item ? (
                    <Box>
                      {item?.image ? (
                        <img
                          className="search-lead-image"
                          src={item?.image}
                          alt="student-img"
                        />
                      ) : (
                        <Avatar className="search-lead-image"></Avatar>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="caption"
                          dangerouslySetInnerHTML={{
                            __html: item?._formatted?.first_name,
                          }}
                        ></Typography>
                        {item?._formatted?.middle_name?.length > 0 && (
                          <Typography
                            variant="caption"
                            dangerouslySetInnerHTML={{
                              __html: item?._formatted?.middle_name,
                            }}
                          ></Typography>
                        )}
                        {item?._formatted?.last_name?.length > 0 && (
                          <Typography
                            variant="caption"
                            dangerouslySetInnerHTML={{
                              __html: item?._formatted?.last_name,
                            }}
                          ></Typography>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        animation="wave"
                      />
                      <Skeleton width="100%" animation="wave" />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  {item ? (
                    <>
                      <Box className="search-box-single-data">
                        <AssignmentIcon id="search-box-icons" />
                        <Typography
                          dangerouslySetInnerHTML={{
                            __html: item?._formatted?.course_name,
                          }}
                          variant="caption"
                        ></Typography>
                        {item?._formatted?.specialization?.[0]?.length > 0 && (
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html: item?._formatted?.specialization?.[0],
                            }}
                            variant="caption"
                          ></Typography>
                        )}
                      </Box>
                      {item?._formatted?.user_name?.length > 0 && (
                        <Box className="search-box-single-data">
                          <MailOutlineIcon id="search-box-icons" />
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html: item?._formatted?.user_name,
                            }}
                            variant="caption"
                          ></Typography>
                        </Box>
                      )}

                      {item?._formatted?.father_mobile_number?.length > 0 && (
                        <Box className="search-box-single-data">
                          <LocalPhoneIcon id="search-box-icons" />
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html: `${item?._formatted?.father_mobile_number} (Father)`,
                            }}
                            variant="caption"
                          ></Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Skeleton variant="rounded" height={70} animation="wave" />
                  )}
                </Grid>

                <Grid item xs={12} sm={4} md={4} sx={{ p: 1 }}>
                  {item ? (
                    <>
                      {item?._formatted?.mobile_number?.length > 0 && (
                        <Box className="search-box-single-data">
                          <LocalPhoneIcon id="search-box-icons" />
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html: `${item?._formatted?.mobile_number} (Student)`,
                            }}
                            variant="caption"
                          ></Typography>
                        </Box>
                      )}
                      {item?._formatted?.mother_mobile_number?.length > 0 && (
                        <Box className="search-box-single-data">
                          <LocalPhoneIcon id="search-box-icons" />
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html: `${item?._formatted?.mother_mobile_number} (Mother)`,
                            }}
                            variant="caption"
                          ></Typography>
                        </Box>
                      )}

                      {item?._formatted?.guardian_mobile_number?.length > 0 && (
                        <Box className="search-box-single-data">
                          <LocalPhoneIcon id="search-box-icons" />
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html: `${item?._formatted?.guardian_mobile_number} (Guardian)`,
                            }}
                            variant="caption"
                          ></Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Skeleton variant="rounded" height={70} animation="wave" />
                  )}
                </Grid>
              </Grid>
            ))}

            {searchResults?.length === 0 && (
              <Box className="loading-animation-for-search">
                <BaseNotFoundLottieLoader
                  height={250}
                  width={250}
                ></BaseNotFoundLottieLoader>
              </Box>
            )}
          </>
        )}
      </Box>
    </Card>
  );
};

export default SearchBox;
