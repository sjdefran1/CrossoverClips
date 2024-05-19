import { createSlice } from "@reduxjs/toolkit";
import { fetchAllPlayers } from "../../services/PlayerService";

const initialState = {
  loading: true,
  playersLoading: true,
  playerNotFound: false,
  filtersShowing: true,
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
    setPlayerByPid(state, action) {
      let tempPlayer = state.allPlayers.find(
        (player) => player.playerID === action.payload.pid
      );

      if (tempPlayer) {
        state.currentPlayer = tempPlayer;
      } else {
        state.playerNotFound = true;
      }
    },
    setFiltersShowing(state) {
      state.filtersShowing = !state.filtersShowing;
    },
    clearPlayerFilters(state) {
      //TODO
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

export const {
  setPlayer,
  setPlayerByPid,
  setFiltersShowing,
  clearPlayerFilters,
} = playerSlice.actions;
export default playerSlice.reducer;
