import { createSlice } from "@reduxjs/toolkit";
import { fetchAllPlayers } from "../../services/PlayerService";

const initialState = {
  loading: true,
  playersLoading: true,
  currentPlayer: {},
  allPlayers: [],
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer(state, action) {
      state.currentPlayer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllPlayers.pending, (state) => {
      state.playersLoading = true;
    });
    builder.addCase(fetchAllPlayers.fulfilled, (state, action) => {
      state.playersLoading = false;
      state.allPlayers = action.payload;
    });
  },
});

export const { setPlayer } = playerSlice.actions;
export default playerSlice.reducer;
