import { currentSeasonDateRangeGenerator } from "../components/Calendar/utils";
import GetJsonDate from "../hooks/GetJsonDate";

const { firstDayOfSeason, lastDayOfSeason } = currentSeasonDateRangeGenerator();

export const adminDashboardApiPayload = ({
  dateRange,
  selectedSeason,
  programName,
  counselorId,
  school,
  source,
  sort,
  sort_type,
  search,
  query_type,
  program_name,
  counselorIds
}) => {
  //   new Date().setMonth(new Date().getMonth() - 3)
  // );
  const payload = {
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
  };
  if (dateRange?.length > 0) {
    payload.date_range = JSON.parse(GetJsonDate(dateRange));
  }
  if (counselorIds?.length) {
    payload.counselor_ids = counselorIds;
  }
  if (programName?.length > 0) {
    payload.program_name = programName;
  }
  if (counselorId?.length > 0) {
    payload.counselor_Id = counselorId;
  }
  if (school?.length > 0) {
    payload.school_names = school;
  }
  if (source?.length > 0) {
    payload.source = source;
  }

  if (sort?.length > 0) {
    payload.sort = sort;
  }

  if (sort_type?.length > 0) {
    payload.sort_type = sort_type;
  }

  if (search?.length > 0) {
    payload.search = search;
  }

  if (query_type?.length > 0) {
    payload.query_type = query_type;
  }
  if (program_name?.length > 0) {
    payload.program_name = program_name;
  }

  return JSON.stringify(payload);
};

export const adminDashboardLeadApplicationApiPayload = (
  payloadOfFormWiseData,
  selectedSeason
) => {
  const payload = {
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
    counselor_id: [],
    date_range: {},
  };

  if (payloadOfFormWiseData?.counselor_id) {
    payloadOfFormWiseData?.counselor_id.length > 0
      ? (payload.counselor_id = payloadOfFormWiseData?.counselor_id)
      : (payload.counselor_id = []);
  }
  if (selectedSeason) {
    Object.keys(payloadOfFormWiseData?.date_range || {}).length === 0 ||
    !payloadOfFormWiseData?.date_range
      ? (payload.season = JSON.parse(selectedSeason))
      : (payload.season = {});
  }
  if (payloadOfFormWiseData?.date_range?.start_date) {
    Object.keys(payloadOfFormWiseData?.date_range || {}).length > 0
      ? (payload.date_range = JSON.parse(
          JSON.stringify(payloadOfFormWiseData?.date_range)
        ))
      : (payload.date_range = JSON.parse(
          GetJsonDate([firstDayOfSeason, lastDayOfSeason])
        ));
  }

  return JSON.stringify(payload);
};
export const adminDashboardFormWiseApiPayload = ({
  dateRange,
  selectedSeason,
  programName,
  counselor_id,
  school,
  source,
  sort,
  sort_type,
  search,
  query_type,
  program_name,
  preference
}) => {
  //   new Date().setMonth(new Date().getMonth() - 3)
  // );
  const payload = {
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
  };
  if (dateRange?.length > 0) {
    payload.date_range = JSON.parse(GetJsonDate(dateRange));
  }
  if (programName?.length > 0) {
    payload.program_name = programName;
  }
  if (counselor_id?.length > 0) {
    payload.counselor_id = counselor_id;
  }
  if (school?.length > 0) {
    payload.school_names = school;
  }
  if (source?.length > 0) {
    payload.source = source;
  }

  if (sort?.length > 0) {
    payload.sort = sort;
  }

  if (sort_type?.length > 0) {
    payload.sort_type = sort_type;
  }

  if (search?.length > 0) {
    payload.search = search;
  }

  if (query_type?.length > 0) {
    payload.query_type = query_type;
  }
  if (program_name?.length > 0) {
    payload.program_name = program_name;
  }
  if (preference?.length > 0) {
    payload.preference = preference;
  }

  return JSON.stringify(payload);
};
export const counselorPerformanceReportApiPayload = (
  dateRange,
  selectedSeason,
  counselorId,
) => {
  //   new Date().setMonth(new Date().getMonth() - 3)
  // );
  const payload = {
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
  };
  if (dateRange?.length > 0) {
    payload.date_range = JSON.parse(GetJsonDate(dateRange));
  }
  if (counselorId?.length > 0) {
    payload.counselor_Id = counselorId;
  }

  return JSON.stringify(payload);
};
