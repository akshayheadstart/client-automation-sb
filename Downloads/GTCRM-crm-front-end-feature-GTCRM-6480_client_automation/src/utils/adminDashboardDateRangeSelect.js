import { getDateMonthYear } from "../hooks/getDayMonthYear";

export const startAndEndDateSelect = (
  selectedSeason,
  setStartDate,
  setEndDate,
  day
) => {
  try {
    if (selectedSeason?.length) {
      const seasonDate = JSON.parse(selectedSeason);

      if (!seasonDate.start_date || !seasonDate.end_date) {
        throw new Error("Invalid selectedSeason format");
      }

      const startDate = new Date(seasonDate.start_date);
      const endDate = new Date(seasonDate.end_date);
      const today = new Date();

      if (day) {
        if (endDate.getTime() > today.getTime()) {
          setStartDate(
            new Date(
              new Date().setDate(new Date().getDate() - day)
            ).toDateString()
          );
          setEndDate(getDateMonthYear(today));
        } else {
          setStartDate(
            new Date(
              new Date(seasonDate.end_date).setDate(
                new Date(seasonDate.end_date).getDate() - day
              )
            ).toDateString()
          );
          setEndDate(getDateMonthYear(endDate));
        }
      } else {
        setStartDate(getDateMonthYear(startDate));
        setEndDate(getDateMonthYear(endDate));
      }
    } else {
      throw new Error("selectedSeason is not provided or is empty");
    }
  } catch (error) {
    setStartDate("");
    setEndDate("");
  }
};
