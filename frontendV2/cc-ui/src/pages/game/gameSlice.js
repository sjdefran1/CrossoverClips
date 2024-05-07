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
  numberOfQuarters: 4,
  currentShowingPlays: [], // current stat type play list
  allPlayersInGame: [], // list of players for player filter comp
  filteredPlayers: [], // id's of players that have been selected
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    /**
     * Removes or adds a player to the id filter based off if they are
     * already in it
     * @param {*} state
     * @param {*} action player id
     */
    handlePlayerSelect(state, action) {
      if (state.filteredPlayers.includes(action.payload)) {
        state.filteredPlayers = state.filteredPlayers.filter(
          (id) => id !== action.payload
        );
      } else {
        state.filteredPlayers.push(action.payload);
      }
    },
    clearPlayerFilter(state) {
      state.filteredPlayers = initialState.filteredPlayers;
    },
    handleTeamSelect(state, action) {
      //console.log(props.players.filter((player) => player[0] === teamID));
      let players = state.allPlayersInGame.filter(
        (player) => player[0] === action.payload
      );
      let player_ids = players.map((player) => player[2]);
      state.filteredPlayers = player_ids;
    },
    handleQuarterChange(state, action) {
      if (state.quarterSelected === 1 && action.payload === 0) {
        return;
      }
      if (
        state.quarterSelected === state.numberOfQuarters &&
        action.payload === 1
      ) {
        return;
      }

      if (action.payload === 1) {
        state.quarterSelected += 1;
      }
      if (action.payload === 0) {
        state.quarterSelected -= 1;
      }
    },
    handleStatChange(state, action) {
      state.currentlySelectedStatType = action.payload;
      state.currentShowingPlays = initialState.currentShowingPlays;
      state.currentShowingPlays = state.allStatTypePlayDict[action.payload];
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
      state.numberOfQuarters = action.payload.number_quarters;
    });
  },
});

export const {
  changeStatType,
  handlePlayerSelect,
  clearPlayerFilter,
  handleTeamSelect,
  handleQuarterChange,
  handleStatChange,
} = gameSlice.actions;
export default gameSlice.reducer;
