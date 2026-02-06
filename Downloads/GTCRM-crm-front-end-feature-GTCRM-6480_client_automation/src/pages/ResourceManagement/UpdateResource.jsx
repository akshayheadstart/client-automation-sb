/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "../../styles/updateResource.css";
import { Box, Card, Drawer, Typography } from "@mui/material";
import SingleResourceCard from "./SingleResourceCard";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { convertDateFormat } from "../../helperFunctions/filterHelperFunction";
import {
  useGetResourceContentDataQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import { handleChangePage } from "../../helperFunctions/pagination";
import Cookies from "js-cookie";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { useNavigate } from "react-router-dom";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const UpdateResource = ({
  state,
  firstEnterPageLoading,
  setFirstEnterPageLoading,
  getAllUpdateAPIcall,
  setGetAllUpdateAPIcall,
  allResourceContent,
  setAllResourceContent,
  tabValue,
}) => {
  const [messageDrawerOpen, setMessageDrawerOpen] = React.useState(false);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    if (state?.update_resource_id && state?.update_resource_id !== "None") {
      setMessageDrawerOpen(true);
      setToggle(false);
    }
  }, [state]);
  const navigate = useNavigate();
  const handleMessageDrawerOpen = (key) => {
    setMessageDrawerOpen(true);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    getResourceContentInternalServerError,
    setGetResourceContentInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetResourceContent,
    setSomethingWentWrongInGetResourceContent,
  ] = useState(false);
  const [hideEventGetResourceContent, setHideGetResourceContent] =
    useState(false);
  const pushNotification = useToasterHook();

  // const [loading, setLoading] = useState(false);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}updateResourcesSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}updateResourcesSavePageNo`
        )
      )
    : 1;
  const applicationPageSIze = localStorage.getItem(
    `${Cookies.get("userId")}updateResourcesRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}updateResourcesRowPerPage`
        )
      )
    : 10;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [pageSize, setPageSize] = useState(applicationPageSIze);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const { data, isSuccess, isFetching, error, isError } =
    useGetResourceContentDataQuery({
      pageNumber,
      rowsPerPage: pageSize,
      collegeId: collegeId,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setAllResourceContent(data?.data);
          setRowCount(data?.total);
          const updateResources = [...data?.data];
          const ids = updateResources?.map((item) => ({ _id: item._id }));
          const updateResourcesWithPageNumber = ids?.map((application) => {
            const updatedApplication = { ...application };
            updatedApplication.pageNo = pageNumber;
            return updatedApplication;
          });
          localStorage.setItem(
            `${Cookies.get("userId")}updateResources`,
            JSON.stringify(updateResourcesWithPageNumber)
          );
          localStorage.setItem(
            `${Cookies.get("userId")}updateResourcesTotalCount`,
            JSON.stringify(data?.total)
          );
        } else {
          throw new Error("get all Event API response has changed");
        }
      }
      if (isError) {
        // setAllResourceContent([]);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          // setAPICallAgain(false)
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setGetResourceContentInternalServerError,
            setHideGetResourceContent,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInGetResourceContent,
        setHideGetResourceContent,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, error, isError]);
  // use react hook for prefetch data

  const prefetchGetResourceDetailsData = usePrefetch("getResourceContentData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchGetResourceDetailsData
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, pageSize, collegeId]);

  const [indexValue, setIndex] = useState({});
  const [updateResourcesOfLocalStorage, setUpdateResourcesOfLocalStorage] =
    useState([]);

  let applicationIndex = JSON.parse(
    localStorage.getItem(`${Cookies.get("userId")}updateResourcesIndex`)
  );
  //setting the updateResources from localstorage in state

  useEffect(() => {
    const updateResourcesFromLocalStorage = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}updateResources`)
    );
    setUpdateResourcesOfLocalStorage(updateResourcesFromLocalStorage);
  }, [allResourceContent]);

  const handleNextLeadButton = () => {
    setIndex(updateResourcesOfLocalStorage[(applicationIndex += 1)]);
    localStorage.setItem(
      `${Cookies.get("userId")}updateResourcesIndex`,
      JSON.stringify(applicationIndex)
    );
    setToggle(true);
  };

  useEffect(() => {
    if (updateResourcesOfLocalStorage?.length === applicationIndex + 1) {
      const pageNumberLocal = localStorage.getItem(
        `${Cookies.get("userId")}updateResourcesSavePageNo`
      )
        ? parseInt(
            localStorage.getItem(
              `${Cookies.get("userId")}updateResourcesSavePageNo`
            )
          )
        : 1;
      const pageNo = pageNumberLocal + 1;
      callAllApplicationAPi(pageNo);
    }
  }, [applicationIndex]);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [somethingWentWrongInResources, setSomethingWentWrongInResources] =
    useState(false);
  const callAllApplicationAPi = (pageNo) => {
    const allApplicationsUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/resource/get_user_updates/?${
      pageNumber ? `page_num=${pageNo}&page_size=${pageSize}` : ""
    }&college_id=${collegeId}`;

    // setAllApplicationApiLoading(true);
    customFetch(allApplicationsUrl, ApiCallHeaderAndBody(token, "GET"))
      .then((res1) => res1.json())
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.data) {
          try {
            if (Array.isArray(res?.data)) {
              const applications = res?.data;
              const ids = applications?.map((item) => ({
                _id: item._id,
                pageNo,
              }));
              localStorage.setItem(
                `${Cookies.get("userId")}updateResources`,
                JSON.stringify([...updateResourcesOfLocalStorage, ...ids])
              );
              setUpdateResourcesOfLocalStorage([
                ...updateResourcesOfLocalStorage,
                ...ids,
              ]);
            } else {
              throw new Error("All Applications API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInResources,
              "",
              10000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((err) => {
        navigate("/page500");
      });
  };
  return (
    <Box>
      {somethingWentWrongInGetResourceContent ||
      getResourceContentInternalServerError ? (
        <>
          {getResourceContentInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInGetResourceContent && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <>
          {isFetching ? (
            <>
              <Box className="loading-animation">
                <LeefLottieAnimationLoader
                  height={200}
                  width={180}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              {allResourceContent?.length > 0 ? (
                <Box>
                  {allResourceContent?.map((data, index) => {
                    return (
                      <Card
                        sx={{
                          visibility: hideEventGetResourceContent
                            ? "hidden"
                            : "visible",
                        }}
                        onClick={() => {
                          handleMessageDrawerOpen();
                          setIndex(data);
                          setToggle(true);
                          localStorage.setItem(
                            `${Cookies.get("userId")}updateResourcesIndex`,
                            JSON.stringify(index)
                          );
                        }}
                        className="update-resource-card-container"
                        key={data?._id}
                      >
                        <Box className="update-resource-box-container-name">
                          <Typography className="update-resource-title">
                            {data?.title}
                          </Typography>
                          <Box className="update-resource-user-name-box">
                            <Typography className="update-resource-user-name">
                              {data?.created_by_name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="update-resource-box-container-data">
                          <Box>
                            <Typography className="update-resource-description">
                              {data?.content}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="update-resource-date-box">
                          <Typography className="update-resource-date-text">
                            {convertDateFormat(data?.created_at)}
                          </Typography>
                        </Box>
                      </Card>
                    );
                  })}
                  {allResourceContent?.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginRight: "32px",
                      }}
                    >
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        page={pageNumber}
                        totalCount={rowCount}
                        pageSize={pageSize}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `updateResourcesSavePageNo`,
                            setPageNumber
                          )
                        }
                        count={count}
                      />
                      <AutoCompletePagination
                        rowsPerPage={pageSize}
                        rowPerPageOptions={rowPerPageOptions}
                        setRowsPerPageOptions={setRowsPerPageOptions}
                        rowCount={rowCount}
                        page={pageNumber}
                        setPage={setPageNumber}
                        localStorageChangeRowPerPage={`updateResourcesRowPerPage`}
                        localStorageChangePage={`updateResourcesSavePageNo`}
                        setRowsPerPage={setPageSize}
                      ></AutoCompletePagination>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "55vh",
                    alignItems: "center",
                  }}
                  data-testid="not-found-animation-container"
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
        </>
      )}
      {/* drawer */}
      <Drawer
        anchor={"right"}
        open={messageDrawerOpen}
        onClose={() => {
          setMessageDrawerOpen(false);
        }}
      >
        <Box className="update-resource-drawer-box-container">
          <Box>
            <SingleResourceCard
              setIndex={setIndex}
              indexValue={indexValue}
              allResourceContentLength={allResourceContent?.length}
              setMessageDrawerOpen={setMessageDrawerOpen}
              updateId={
                toggle
                  ? indexValue?._id
                  : state?.update_resource_id
                  ? state?.update_resource_id
                  : ""
              }
              state={state}
              setToggle={setToggle}
              toggle={toggle}
              handleNextLeadButton={handleNextLeadButton}
              applicationIndex={applicationIndex}
              somethingWentWrongInResources={somethingWentWrongInResources}
              updateResourcesOfLocalStorage={updateResourcesOfLocalStorage}
            ></SingleResourceCard>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UpdateResource;
