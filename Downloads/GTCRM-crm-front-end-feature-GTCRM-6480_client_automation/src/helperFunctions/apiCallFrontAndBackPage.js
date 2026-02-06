const prefetchData = (
  fetchPages,
  pageNumber,
  rowsPerPage,
  collegeId,
  prefetchingData,
  payloadForPrefetchingData,
  twelveScoreSort
) => {
  for (let index = 1; index <= fetchPages; index++) {
    prefetchingData({
      pageNumber: pageNumber + index,
      rowsPerPage: rowsPerPage,
      collegeId: collegeId,
      ...payloadForPrefetchingData,
      twelveScoreSort: twelveScoreSort,
    });
  }
};

export const apiCallFrontAndBackPage = (
  applicationData,
  rowsPerPage,
  pageNumber,
  collegeId,
  prefetchingData,
  payloadForPrefetchingData,
  twelveScoreSort
) => {
  const numberOfFetchPage = 3;
  const maximumPageNumber = Math.ceil(
    (applicationData?.total || applicationData?.count) / rowsPerPage
  );

  let fetchFrontPages = maximumPageNumber - pageNumber;
  if (fetchFrontPages >= numberOfFetchPage) {
    fetchFrontPages = numberOfFetchPage - 1;
  }

  prefetchData(
    fetchFrontPages,
    pageNumber,
    rowsPerPage,
    collegeId,
    prefetchingData,
    payloadForPrefetchingData,
    twelveScoreSort
  );
};
