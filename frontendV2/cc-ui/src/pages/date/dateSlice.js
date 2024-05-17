import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDaysToHighlight,
  fetchGamesByDate,
} from "../../services/GameService";
import dayjs from "dayjs";

const initialState = {
  dateStr: dayjs().format("YYYY-MM-DD"), // value of DateCalendar
  calendarLoading: true, // fetching days to highlight
  daysToHighlight: [], // {1: 2, 2: 4} renders badge for days with games
  loading: false, // loading new games for date
  gameList: [],
  isQuickLink: false, // when being redirected from quick link
  // avoids handleMonthChange setting the calendar to the first
  // when the month changes
};

export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    changeDateSelected(state, action) {
      state.gameList = initialState.gameList;
      state.dateStr = action.payload;
    },
    setQuickLink(state, action) {
      state.isQuickLink = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGamesByDate.pending, (state) => {
      state.gameList = initialState.gameList;
      state.loading = true;
    });
    builder.addCase(fetchGamesByDate.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload !== "no games") {
        state.gameList = action.payload;
      } else {
        state.gameList = [];
      }
    });

    builder.addCase(fetchDaysToHighlight.pending, (state) => {
      state.calendarLoading = true;
    });
    builder.addCase(fetchDaysToHighlight.fulfilled, (state, action) => {
      state.calendarLoading = false;
      state.daysToHighlight = action.payload;
      if (state.isQuickLink === true) {
        state.isQuickLink = false;
      }
    });
  },
});

export const { changeDateSelected, setQuickLink } = dateSlice.actions;
export default dateSlice.reducer;
