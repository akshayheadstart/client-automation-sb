import { Box, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import "../../styles/CalendarMOD.css";
import {
  DateControls,
  HeadDays,
  SeeMore,
  SevenColGrid,
  StyledEvent,
  Wrapper,
} from "./Calendar.styled";
import { DAYS } from "./counts";
import {
  datesAreOnSameDay,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
} from "./utils";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import "../../styles/calendar.css";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";

const Calender = ({
  setOpen,
  setCurrentDateToCalenderMOD,
  setDate,
  applyFilterPayload,
  filterDataPayload,
  setPanelOrSlot,
  setReschedule,
  setCheckBoxSlotIndex,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const monthNumericValue = currentDate?.getMonth() + 1; // JavaScript months are 0-indexed, so add 1
  const yearNumericValue = currentDate?.getFullYear();
  const [dataYear, setDataYear] = useState(currentYear);
  const handleDayData = (currentDate, day) => {
    const date = new Date(currentDate);
    const formattedDate = date.toDateString();
    const dataSlice = formattedDate.slice(4, 7);
    const yearSlice = formattedDate.slice(11, 16);
    const formatOfDate = `${dataSlice} ${
      day.toString().length > 1 ? day : `0${day}`
    } ${yearSlice}`;
    setCurrentDateToCalenderMOD(new Date(formatOfDate));
  };
  const handleDayFetchData = (currentToFetchDate, dayToFetch) => {
    const date = new Date(currentToFetchDate);
    const formattedDate = date.toDateString();
    const dataSlice = formattedDate.slice(4, 7);
    const yearSlice = formattedDate.slice(11, 16);
    const formatOfDate = `${dataSlice} ${
      dayToFetch.toString().length > 1 ? dayToFetch : `0${dayToFetch}`
    } ${yearSlice}`;
    const dateArray = formatOfDate?.split(" ");
    const month = dateArray[0];
    const day = dateArray[1];
    const year = dateArray[2];
    const dateObject = new Date(`${month} ${day}, ${year}`);
    const formattedYear = dateObject.getFullYear();
    const formattedMonth = (dateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Adding 1 since getMonth() returns 0-based month index
    const formattedDay = dateObject.getDate().toString().padStart(2, "0");
    return setDate(`${formattedYear}-${formattedMonth}-${formattedDay}`);
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    const newDate = new Date(currentDate);
    newDate.setMonth(selectedMonth - 1);
    setCurrentDate(newDate);
  };
  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    const newDate = new Date(currentDate);
    newDate.setFullYear(selectedYear);
    setCurrentDate(newDate);
    setDataYear(selectedYear);
  };

  const startYear = 2000;
  const endYear = 2099;

  const yearOptions = [];
  for (let year = startYear; year <= endYear; year++) {
    yearOptions.push(year);
  }
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [somethingWentWrongInPIGDGetData, setSomethingWentWrongInPIGDGetData] =
    useState(false);
  const [pIGDGetDataInternalServerError, setPIGDGetDataInternalServerError] =
    useState(false);
  const [allPiGdData, setAllPiGdData] = useState([]);
  const [loading, setLoading] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/planner/calender_info/?month=${monthNumericValue}&year=${yearNumericValue}&college_id=${collegeId}`;
    customFetch(
      url,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(applyFilterPayload))
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else if (result) {
          try {
            if (Array.isArray(result)) {
              setAllPiGdData(result);
            } else {
              throw new Error("Get panelist API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInPIGDGetData,
              "",
              10000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(setPIGDGetDataInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoading(false);
        // setFirstLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, yearNumericValue, monthNumericValue, applyFilterPayload]);
  const handleDateFormat = (date) => {
    let year = date?.slice(0, 4);
    let yearParseInt = parseInt(year);
    let month = date?.slice(5, 7);
    let monthParseInt = parseInt(month);
    let day = date?.slice(8, 11);
    let dayParseInt = parseInt(day);
    return new Date(yearParseInt, monthParseInt, dayParseInt);
  };

  return (
    <>
      {pIGDGetDataInternalServerError || somethingWentWrongInPIGDGetData ? (
        <>
          {pIGDGetDataInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInPIGDGetData && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <>
          {loading ? (
            <>
              <Box className="loading-animation">
                <LeefLottieAnimationLoader
                  height={200}
                  width={180}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <Box className="drawer-calendar-minWidth">
              <Wrapper>
                <DateControls style={{ fontWeight: 800, fontSize: 25 }}>
                  <FormControl>
                    <NativeSelect
                      defaultValue={currentMonth}
                      inputProps={{
                        name: "month",
                        id: "uncontrolled-native",
                      }}
                      onChange={handleMonthChange}
                      style={{ fontWeight: 800, paddingLeft: "10px" }}
                    >
                      <option value={"1"}>January</option>
                      <option value={"2"}>February</option>
                      <option value={"3"}>March</option>
                      <option value={"4"}>April</option>
                      <option value={"5"}>May</option>
                      <option value={"6"}>June</option>
                      <option value={"7"}>July</option>
                      <option value={"8"}>August</option>
                      <option value={"9"}>September</option>
                      <option value={"10"}>October</option>
                      <option value={"11"}>November</option>
                      <option value={"12"}>December</option>
                    </NativeSelect>
                  </FormControl>

                  {getMonthYear(currentDate)}
                  <FormControl>
                    <NativeSelect
                      style={{ fontWeight: 800 }}
                      onChange={handleYearChange}
                      defaultValue={dataYear}
                      inputProps={{
                        name: "year",
                        id: "uncontrolled-native",
                      }}
                    >
                      {yearOptions?.map((year, index) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </DateControls>
                <SevenColGrid>
                  {DAYS.map((day) => (
                    <HeadDays className="header-data-text">{day}</HeadDays>
                  ))}
                </SevenColGrid>

                <SevenColGrid
                  fullheight={true}
                  is28Days={getDaysInMonth(currentDate) === 28}
                >
                  {getSortedDays(currentDate).map((day) => (
                    <div
                      style={{ cursor: "pointer" }}
                      className={`header-data-text ${
                        datesAreOnSameDay(
                          new Date(),
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            day
                          )
                        )
                          ? "activeDivDay"
                          : ""
                      }`}
                      onClick={() => {
                        handleDayData(currentDate, day);
                        handleDayFetchData(currentDate, day);
                        setOpen(false);
                        setPanelOrSlot(false);
                        setCheckBoxSlotIndex({});
                        // setReschedule(false)
                      }}
                      id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
                    >
                      <span
                        style={{ fontWeight: 800 }}
                        className={`header-data-text ${
                          datesAreOnSameDay(
                            new Date(),
                            new Date(
                              currentDate.getFullYear(),
                              currentDate.getMonth(),
                              day
                            )
                          )
                            ? "activeDay"
                            : ""
                        }`}
                      >
                        {day}
                      </span>
                      <EventWrapper>
                        {allPiGdData?.map(
                          (ev, index) =>
                            datesAreOnSameDay(
                              handleDateFormat(ev?.date),
                              new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth() + 1,
                                day
                              )
                            ) && (
                              <StyledEvent style={{ color: "black" }}>
                                {ev?.PiTotal > 0 || ev?.GdTotal > 0 ? (
                                  <Typography
                                    sx={{
                                      height: "7px",
                                      width: "7px",
                                      backgroundColor: "#E06259",
                                      borderRadius: 50,
                                      ml: "54px",
                                      mt: -2.2,
                                    }}
                                  ></Typography>
                                ) : (
                                  ""
                                )}
                                {ev?.PiTotal === 0 ? (
                                  ""
                                ) : (
                                  <>
                                    {ev?.PiTotal > 0 ? (
                                      <Typography
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Typography sx={{ fontSize: "13px" }}>
                                          PI-
                                        </Typography>
                                        <Typography
                                          sx={{
                                            color: "#0055C2",
                                            fontWeight: 800,
                                            whiteSpace: "nowrap",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {ev.PiTotal > 0
                                            ? `${ev.Pibooked}/${ev.PiTotal}`
                                            : "0"}
                                        </Typography>
                                      </Typography>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                )}
                                {ev.GdTotal === 0 ? (
                                  ""
                                ) : (
                                  <>
                                    {ev.GdTotal > 0 ? (
                                      <Typography
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Typography sx={{ fontSize: "13px" }}>
                                          GD-
                                        </Typography>
                                        <Typography
                                          sx={{
                                            color: "#0055C2",
                                            fontWeight: 800,
                                            whiteSpace: "nowrap",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {ev.GdTotal > 0
                                            ? `${ev.Gdbooked}/${ev.GdTotal}`
                                            : "0"}
                                        </Typography>
                                      </Typography>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                )}
                              </StyledEvent>
                            )
                        )}
                      </EventWrapper>
                    </div>
                  ))}
                </SevenColGrid>
              </Wrapper>
            </Box>
          )}
        </>
      )}
    </>
  );
};

const EventWrapper = ({ children }) => {
  if (children.filter((child) => child).length)
    return (
      <>
        {children}
        {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            see more...
          </SeeMore>
        )}
      </>
    );
};

export default Calender;
