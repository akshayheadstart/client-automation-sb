/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, CardContent, Divider } from "@mui/material";
import React, { useContext, useEffect } from "react";
import "../../styles/inteviewList.css";
import "../../styles/createInterviewRoomList.css";
import InterviewListHeader from "../../components/Interview/InterviewListHeader";
import ListIcon from "@mui/icons-material/List";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { useState } from "react";
import InterviewListTable from "../../components/Interview/InterviewListTable";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import InterviewListCard from "../../components/Interview/InterviewListCard";
import InterviewListTableActions from "../../components/Interview/InterviewListTableActions";
import {
  useGetInterviewListDataQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Cookies from "js-cookie";
import ArchivedListDialog from "../../components/Interview/ArchivedListDialog";
import useDebounce from "../../hooks/useDebounce";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";

const InterviewList = () => {
  const [tabState, setTabState] = useState(1);
  const [selectedInterviewListCard, setSelectedInterviewListCard] = useState(
    []
  );

  const pushNotification = useToasterHook();

  const [searchText, setSearchText] = useState("");

  const [openArchivedListDialog, setOpenArchivedListDialog] = useState(false);

  const [interviewStatus, setInterviewStatus] = useState("");

  const handleOpenArchivedListDialog = () => {
    setOpenArchivedListDialog(true);
    setSearchText("");
    setPageNumber(1);
    setInterviewStatus("archived");
  };

  const handleCloseArchivedListDialog = () => {
    setOpenArchivedListDialog(false);
    setInterviewStatus("");
  };

  const tableViewLocalStorage = `${Cookies.get(
    "userId"
  )}selectedInterviewListRow`;

  const cardViewLocalStorage = `${Cookies.get(
    "userId"
  )}selectedInterviewListCard`;

  const archivedListLocalStorage = `${Cookies.get(
    "userId"
  )}selectedArchivedListRow`;

  const [interviewListData, setInterviewListData] = useState([]);

  const [selectedInterviewListRow, setSelectedInterviewListRow] = useState([]);

  const [hideInterviewList, setHideInterviewList] = useState(false);

  const [interviewListSomethingWentWrong, setInterviewListSomethingWentWrong] =
    useState(false);
  const [
    interviewListInternalServerError,
    setInterviewListInternalServerError,
  ] = useState(false);
  const [openCreateInterview, setOpenCreateInterview] = useState(false);

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  //selected item actions section
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();

  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [totalInterviewList, setTotalInterviewList] = useState(0);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const debouncedSearchText = useDebounce(searchText, 500);

  const {
    data: interviewList,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetInterviewListDataQuery({
    collegeId,
    pageNumber: debouncedSearchText ? "" : pageNumber,
    rowsPerPage: debouncedSearchText ? "" : pageSize,
    searchInput: debouncedSearchText,
    interviewStatus: interviewStatus,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(interviewList?.data)) {
          setInterviewListData(interviewList?.data);
          setTotalInterviewList(interviewList?.total);
        } else {
          throw new Error("gd pi interview list API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setInterviewListInternalServerError,
            setHideInterviewList,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setInterviewListSomethingWentWrong,
        setHideInterviewList,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewList, error, isError, isSuccess]);

  // use react hook for this
  const prefetchInterviewList = usePrefetch("getInterviewListData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      interviewList,
      debouncedSearchText ? "" : pageSize,
      debouncedSearchText ? "" : pageNumber,
      collegeId,
      prefetchInterviewList,
      {
        searchInput: debouncedSearchText,
        interviewStatus: interviewStatus,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    interviewList,
    pageNumber,
    pageSize,
    collegeId,
    interviewStatus,
    debouncedSearchText,
  ]);

  const [searchResultShow, setSearchResultShow] = useState(false);

  const slicedData = interviewListData?.slice(0, 7);

  const [showingListCount, setShowingListCount] = useState(0);

  useEffect(() => {
    if (!searchResultShow) {
      setTotalInterviewList(interviewList?.total);

      if (tabState === 1) {
        setShowingListCount(slicedData?.length);
      } else {
        setShowingListCount(interviewListData?.length);
      }
    } else {
      setTotalInterviewList(interviewListData?.length);
      setShowingListCount(interviewListData?.length);
    }
  }, [
    interviewList,
    slicedData,
    tabState,
    interviewListData,
    searchResultShow,
  ]);

  useEffect(() => {
    if (!searchText?.length) {
      setSearchResultShow(false);
      setSelectedInterviewListCard([]);
      setSelectedInterviewListRow([]);
      localStorage.removeItem(tableViewLocalStorage);
      localStorage.removeItem(cardViewLocalStorage);
      localStorage.removeItem(archivedListLocalStorage);
    } else {
      setSearchResultShow(true);
      setSelectedInterviewListCard([]);
      setSelectedInterviewListRow([]);
      localStorage.removeItem(tableViewLocalStorage);
      localStorage.removeItem(cardViewLocalStorage);
    }
  }, [
    cardViewLocalStorage,
    searchText,
    tableViewLocalStorage,
    archivedListLocalStorage,
  ]);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //InterView list Head Title add
  useEffect(() => {
    setHeadTitle("GD/PI list");
    document.title = "GD/PI list";
  }, [headTitle]);
  return (
    <Box sx={{ px: 3, pb: 3 }} className="interview-List-box-container">
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <InterviewListHeader
            openCreateInterview={openCreateInterview}
            setOpenCreateInterview={setOpenCreateInterview}
            setSearchText={setSearchText}
            searchText={searchText}
          />

          <Box className="interview-table-tab-design">
            <Box className="interview-table-tab-design-left">
              <Box
                className="interview-table-tab-design-left-text"
                sx={{ mb: "-15px" }}
              >
                <TableDataCount
                  totalCount={totalInterviewList}
                  currentPageShowingCount={showingListCount}
                  pageNumber={pageNumber}
                  rowsPerPage={pageSize}
                />
              </Box>
              <Divider orientation="vertical" flexItem></Divider>
            </Box>

            <Box className="interview-table-tab-design-right">
              <Box
                onClick={handleOpenArchivedListDialog}
                className="interview-table-tab-design-right-side-left-text"
              >
                Archived Lists
              </Box>
              <Box className="interview-table-tab-design-right-side-right-item">
                <Box
                  onClick={() => setTabState(1)}
                  className={
                    tabState === 1
                      ? "interview-left-Tab-design-active "
                      : "interview-left-Tab-design-inactive"
                  }
                >
                  <ListIcon
                    sx={{ color: tabState === 1 ? "#008be2" : "#bcbec0" }}
                  >
                    {" "}
                  </ListIcon>
                </Box>
                <Box
                  onClick={() => setTabState(2)}
                  className={
                    tabState === 2
                      ? "interview-right-Tab-design-active"
                      : "interview-right-Tab-design-inactive"
                  }
                >
                  <ViewCompactIcon
                    sx={{ color: tabState === 2 ? "#008be2" : "#bcbec0" }}
                  ></ViewCompactIcon>
                </Box>
              </Box>
            </Box>
          </Box>
          {tabState === 1 && (
            <InterviewListCard
              setOpenCreateInterview={setOpenCreateInterview}
              interviewListData={interviewListData}
              isFetching={isFetching}
              interviewListInternalServerError={
                interviewListInternalServerError
              }
              interviewListSomethingWentWrong={interviewListSomethingWentWrong}
              hideInterviewList={hideInterviewList}
              selectedInterviewList={selectedInterviewListCard}
              setSelectedInterviewList={setSelectedInterviewListCard}
              localStorageKeyName={cardViewLocalStorage}
            />
          )}
          {tabState === 2 && (
            <InterviewListTable
              paginationRef={paginationRef}
              interviewListData={interviewListData}
              isFetching={isFetching}
              interviewListInternalServerError={
                interviewListInternalServerError
              }
              interviewListSomethingWentWrong={interviewListSomethingWentWrong}
              hideInterviewList={hideInterviewList}
              selectedInterviewList={selectedInterviewListRow}
              setSelectedInterviewList={setSelectedInterviewListRow}
              localStorageKeyName={tableViewLocalStorage}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalInterviewList={totalInterviewList}
              searchResultShow={searchResultShow}
            />
          )}

          {(tabState === 1
            ? selectedInterviewListCard?.length > 0
            : tabState === 2 && selectedInterviewListRow?.length > 0) && (
            <InterviewListTableActions
              isScrolledToPagination={isScrolledToPagination}
              selectedInterviewList={
                tabState === 1
                  ? selectedInterviewListCard
                  : tabState === 2 && selectedInterviewListRow
              }
              setSelectedInterviewList={
                tabState === 1
                  ? setSelectedInterviewListCard
                  : tabState === 2 && setSelectedInterviewListRow
              }
              setInterviewListInternalServerError={
                setInterviewListInternalServerError
              }
              setInterviewListSomethingWentWrong={
                setInterviewListSomethingWentWrong
              }
              localStorageKeyName={
                tabState === 1
                  ? cardViewLocalStorage
                  : tabState === 2 && tableViewLocalStorage
              }
              localStorageKey={
                tabState === 1
                  ? "selectedInterviewListCard"
                  : "selectedInterviewListRow"
              }
            />
          )}

          {openArchivedListDialog && (
            <>
              <ArchivedListDialog
                open={openArchivedListDialog}
                handleClose={handleCloseArchivedListDialog}
                interviewListData={interviewListData}
                isFetching={isFetching}
                interviewListInternalServerError={
                  interviewListInternalServerError
                }
                interviewListSomethingWentWrong={
                  interviewListSomethingWentWrong
                }
                hideInterviewList={hideInterviewList}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalInterviewList={totalInterviewList}
                isScrolledToPagination={isScrolledToPagination}
                setInterviewListInternalServerError={
                  setInterviewListInternalServerError
                }
                setInterviewListSomethingWentWrong={
                  setInterviewListSomethingWentWrong
                }
                localStorageKeyName={archivedListLocalStorage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default InterviewList;
