import * as React from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDaysToHighlight,
  fetchGamesByDate,
} from "../../services/GameService";
import { changeDateSelected } from "./dateSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";

function ServerDay(props) {
  const { daysToHighlight, day, outsideCurrentMonth, ...other } = props;

  // Retrieve game count for the day
  const gameCount = daysToHighlight[dayjs(day).date()];
  // console.log(dayjs(day).date() + " gameCount: " + gameCount);
  // console.log(dayjs(day).date() + " outside: " + outsideCurrentMonth);
  return (
    <Badge
      key={day}
      variant='dot'
      color='success'
      overlap='circular'
      // anchorOrigin={{ vertical: "bottom" }}
      invisible={outsideCurrentMonth || gameCount === undefined}>
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        disabled={gameCount === undefined}
      />
    </Badge>
  );
}

export default function CustomDateCalendar() {
  const { dateStr, daysToHighlight, calendarLoading } = useSelector(
    (state) => state.date
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dateurlstr } = useParams();

  const handleMonthChange = (date) => {
    let newDateStr = dayjs(date).format("YYYY-MM-DD").toString();

    // update current date selected and url
    // fetch highlighted days
    dispatch(changeDateSelected(newDateStr));
    navigate("/date/" + newDateStr);
    dispatch(fetchDaysToHighlight(newDateStr));
    dispatch(fetchGamesByDate(newDateStr));
  };

  React.useEffect(() => {
    // manual url entered
    // make it so that is actually what shows up instead
    // of "today" date
    if (dateurlstr !== dateStr) {
      dispatch(changeDateSelected(dateurlstr));
      dispatch(fetchGamesByDate(dateurlstr));
      dispatch(fetchDaysToHighlight(dateurlstr));
      return;
    }
  }, [dateurlstr]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ justifyContent: "center" }}>
        <DateCalendar
          value={dayjs(dateStr)}
          loading={calendarLoading}
          onMonthChange={handleMonthChange}
          minDate={dayjs("2014-10-28")}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              daysToHighlight,
            },
          }}
          onChange={(newValue) => {
            // new day of the month selected
            let newDate = newValue.format("YYYY-MM-DD");
            dispatch(changeDateSelected(newDate));
            navigate("/date/" + newDate);
            dispatch(fetchGamesByDate(newDate));
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
