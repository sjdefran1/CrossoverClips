import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDaysToHighlight,
  fetchGamesByDate,
} from "../../services/GameService";
import dayjs from "dayjs";

const initialState = {
  dateStr: dayjs().format("YYYY-MM-DD"),
  calendarLoading: true,
  daysToHighlight: [],
  loading: false,
  gameList: [],
};

export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    changeDateSelected(state, action) {
      state.gameList = initialState.gameList;
      state.dateStr = action.payload;
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
    });
  },
});

export const { changeDateSelected } = dateSlice.actions;
export default dateSlice.reducer;
