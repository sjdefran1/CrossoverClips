import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBasicGameInfo,
  fetchPlayByPlayByGameId,
} from "../../services/GameService";

const initialState = {
  gid: null,
  basicGameInfoLoading: true, // teams, stats, score etc
  playByPlayLoading: true,
  seasonStr: "",
  dateStr: "",
  homeTeam: {}, // stores basic team info, as well as team stats info for this game
  awayTeam: {}, // ^^
  allStatTypePlayDict: {}, // {fgm: [], ast: [] ...}
  currentlySelectedStatType: "FGM", // What user has selected to show
  quarterSelected: 1,
  currentShowingPlays: [], // current stat type play list
  allPlayersInGame: [], // list of players for player filter comp
  filteredPlayers: [], // id's of players that have been selected
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    changeStatType(state, action) {
      state.currentlySelectedStatType = action.payload;
    },
  },
  extraReducers: (builder) => {
    /**
     * Basic Game Info
     */
    builder.addCase(fetchBasicGameInfo.fulfilled, (state, action) => {
      state.basicGameInfoLoading = false;
      state.homeTeam = action.payload.home_info;
      state.awayTeam = action.payload.away_info;
      state.gid = action.payload.game_id;
      state.dateStr = action.payload.date;
      state.seasonStr = action.payload.season_str;
    });
    /**
     * PlayByPlay
     */
    builder.addCase(fetchPlayByPlayByGameId.fulfilled, (state, action) => {
      state.playByPlayLoading = false;
      // set the whole dict {fgm: [fgm plays]...}
      // set the currently showing to just fgm at start
      state.allStatTypePlayDict = action.payload.plays;
      state.currentShowingPlays =
        action.payload.plays[state.currentlySelectedStatType];

      state.allPlayersInGame = action.payload.players;
    });
  },
});

export const { changeStatType } = gameSlice.actions;
export default gameSlice.reducer;
