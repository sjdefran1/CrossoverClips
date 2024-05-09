import { createSlice } from "@reduxjs/toolkit";
import { fetchGamesByDate } from "../../services/GameService";
import dayjs from "dayjs";

const initialState = {
  dateStr: dayjs().format("YYYY-MM-DD"),
  loading: false,
  gameList: [],
};

export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    changeDateSelected(state, action) {
      state.dateStr = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGamesByDate.pending, (state) => {
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
  },
});

export const { changeDateSelected } = dateSlice.actions;
export default dateSlice.reducer;
