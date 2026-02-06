/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Card } from '@mui/material';
import React, { useState } from 'react';
import '../../styles/studentTotalQueries.css'
import StudentTotalQueriesText from './StudentTotalQueriesText';
import IconDateRangePicker from '../../components/shared/filters/IconDateRangePicker';

import useToasterHook from '../../hooks/useToasterHook';
import { useSelector } from 'react-redux';

import { useContext } from 'react';
import { LayoutSettingContext } from '../../store/contexts/LayoutSetting';
import { DashboradDataContext } from '../../store/contexts/DashboardDataContext';
import { handleSomethingWentWrong } from '../../utils/handleSomethingWentWrong';
import { handleInternalServerError } from '../../utils/handleInternalServerError';
import { ErrorFallback } from '../../hooks/ErrorFallback';
import Error500Animation from '../../components/shared/ErrorAnimation/Error500Animation';
import LeefLottieAnimationLoader from '../../components/shared/Loader/LeefLottieAnimationLoader';
import { GetFormatDate } from '../../hooks/GetJsonDate';
import DateRangeShowcase from '../../components/shared/CalendarTimeData/DateRangeShowcase';
import { useEffect } from 'react';
import { getDateMonthYear } from '../../hooks/getDayMonthYear';
import { useGetStudentTotalQueriesDataQuery } from '../../Redux/Slices/applicationDataApiSlice';
import BaseNotFoundLottieLoader from '../../components/shared/Loader/BaseNotFoundLottieLoader';


const StudentTotalQueriesHeader = () => {
  const [studentHeaderData,setStudentHeaderData]=useState({})
  const [filterDateValue,setFilterDateValue]=useState([])
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const {
    selectedSeason
  } = useContext(LayoutSettingContext);
  const filterDataPayload ={
    season:selectedSeason? JSON.parse(selectedSeason)?.season_id:'',
    date_range:
    filterDateValue?.length > 0
      ? GetFormatDate(filterDateValue)
      : {},
  }
  const [somethingWentWrongInStudentHeader, setSomethingWentWrongInStudentHeader] =
    useState(false);
  const [studentHeaderInternalServerError, setStudentHeaderInternalServerError] =
    useState(false);
  const { data, isSuccess, isFetching, error, isError } =
  useGetStudentTotalQueriesDataQuery(
    {
      filterDataPayload: filterDateValue?.length > 0? filterDataPayload:{},
      collegeId: collegeId,
    },
    { skip: false }
  );
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setStudentHeaderData(data?.data[0])
        } else {
          throw new Error("get_details API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setStudentHeaderInternalServerError,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInStudentHeader, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data,
    error?.data?.detail,
    isError,
    isSuccess,
    setApiResponseChangeMessage,
  ]);

   const dataDummySet = [
    {
      labelText1:'Todays',
      labelText2:'Queries',
      value:studentHeaderData?.today_queries
    },
    {
      labelText1:'Open',
      labelText2:'Queries',
      value:studentHeaderData?.open
    },
    {
      labelText1:'Unresolved',
      labelText2:'Queries',
      value:studentHeaderData?.un_resolved
    },
    {
      labelText1:'Resolved',
      labelText2:'Queries',
      value:studentHeaderData?.resolved
    },
  ]
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  useEffect(()=>{
    if (filterDateValue?.length > 1) {
      setStartDateRange(getDateMonthYear(filterDateValue[0]));
      setEndDateRange(getDateMonthYear(filterDateValue[1]));
    }

  },[filterDateValue])
    
    return (
      <Box sx={{position:'relative'}}>
         {filterDateValue?.length > 0 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => setFilterDateValue([])}
        ></DateRangeShowcase>
        )}
        <Card className='student-queries-header-card'>
        
          {
            studentHeaderInternalServerError ||
            somethingWentWrongInStudentHeader?
            (
              <>
                {(studentHeaderInternalServerError) && (
                  <Error500Animation height={200} width={200}></Error500Animation>
                )}
                {(somethingWentWrongInStudentHeader) && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </>
            )
            :
            <>
            {
              isFetching?
              (
                <>
                  <Box className="loading-animation">
                    <LeefLottieAnimationLoader
                      height={150}
                      width={180}
                    ></LeefLottieAnimationLoader>
                  </Box>
                </>
              )
              :
              <>
            <Box className='student-queries-header-text-container'>
              {
                Object.keys(studentHeaderData).length>0?
                <>
              {
                dataDummySet?.map((item,index)=>{
                  return(
                    <>
                    <Box>
            <StudentTotalQueriesText
            labelText1={item?.labelText1}
            labelText2={item?.labelText2}
            value={item?.value}
            ></StudentTotalQueriesText>
            </Box>
            {
              (dataDummySet.length -1) !== index &&
            <Box className='student-queries-header-line-design'></Box>
            }
                    </>
                  )
                })
              }
                </>
                :
                <Box
                sx={{
                  display: "grid",
                  minHeight: "100px",
                  placeItems:'center',
                  margin:'auto'
                }}
                data-testid="not-found-animation-container"
              >
                <BaseNotFoundLottieLoader
                  height={150}
                  width={150}
                ></BaseNotFoundLottieLoader>
              </Box>
              }
              <Box>
                    <IconDateRangePicker
                    onChange={setFilterDateValue}
                    dateRange={filterDateValue}
                    >
                    </IconDateRangePicker>
              </Box>
            </Box>
              </>
            }
            </>
          }
         
        </Card>
      </Box>
    );
};

export default StudentTotalQueriesHeader;