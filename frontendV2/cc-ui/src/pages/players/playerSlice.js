import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPlayers,
  fetchFilteredPlays,
} from "../../services/PlayerService";

const initialState = {
  loading: true,
  filteredSearchLoading: false,
  playersLoading: true,
  playerNotFound: false,
  filtersShowing: true,
  currentPlayer: {},

  // filters
  gid: null, // selected game from returned games
  matchupTeamId: [], // games against these id's
  teamId: [], // games while player was on this team
  filterAutoOptions: {
    Season: {
      "2023-24": false,
      "2022-23": false,
      "2021-22": false,
      "2020-21": false,
      "2019-20": false,
      "2018-19": false,
      "2017-18": false,
      "2016-17": false,
      "2015-16": false,
      "2014-15": false,
    },
    "Season Type": { "Regular Season": false, Playoffs: false },
    Court: { Home: false, Away: false },
    Quarter: { 1: false, 2: false, 3: false, 4: false, OT: false },

    "Stat Type": {
      FGM: false,
      AST: false,
      STL: false,
      BLK: false,
      DUNK: false,
    },
  },

  // indexing and pagination
  pageCount: 0,
  numberOfPlays: 0,
  playIndex: 0,
  currentPage: 1,
  currentPagePlays: [],
  currentUrl: "",
  gameShowing: {},

  // results
  noResultsFound: false,
  playResults: [],
  gamesAvailable: {},
  gamesAvailableSortedByPoints: [],

  // all players for search bar
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
    setMatchupId(state, action) {
      state.matchupTeamId = action.payload;
    },
    setPlayerTeamId(state, action) {
      state.teamId = action.payload;
    },
    updatePlayerFilter(state, action) {
      // get if the selected option was true or false, then change it to the opposite
      // {
      //  action.payload.title: {
      //      action.payload.valueToChange: false/true
      //      },
      //  ...
      // }
      let oldVal =
        state.filterAutoOptions[action.payload.title][
          action.payload.valueToChange
        ];
      state.filterAutoOptions[action.payload.title][
        action.payload.valueToChange
      ] = !oldVal;
    },
    clearPlayerTeamId(state) {
      state.teamId = initialState.teamId;
    },
    clearPlayerFilters(state) {
      state.gid = initialState.gid;
      state.matchupTeamId = initialState.matchupTeamId;
      state.teamId = initialState.teamId;
      state.filterAutoOptions = initialState.filterAutoOptions;
    },

    /**
     * Handles user sleecting new play to show
     * @param {*} state
     * @param {*} action new index value
     */
    setPlayIndex(state, action) {
      state.playIndex = action.payload;
      state.currentUrl = state.currentPagePlays[action.payload].url;
      // updates the view count locally, making it seem like the view
      // count when up on the user screen, the request is being made in the bg
      state.currentPagePlays[action.payload].views += 1;

      let currentGid = state.currentPagePlays[action.payload].gid;
      let newGame = state.gamesAvailable[currentGid];
      state.gameShowing = { ...newGame, gid: currentGid };
    },
    /**
     *
     * @param {*} state
     * @param {*} action new page value
     */
    handlePaginationChange(state, action) {
      console.log(action.payload);
      state.currentPage = action.payload;
      state.playIndex = 0;
      state.currentPagePlays = state.playResults[action.payload];
      // new page, first plays url
      state.currentUrl = state.currentPagePlays[0].url;

      let currentGid = state.currentPagePlays[0].gid;
      let newGame = state.gamesAvailable[currentGid];
      state.gameShowing = { ...newGame, gid: currentGid };
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

    builder.addCase(fetchFilteredPlays.pending, (state) => {
      //TODO
      // Loading States
      state.filteredSearchLoading = true;
      state.filtersShowing = false;
    });

    /**
     * Responsible for setting most of the state
     */
    builder.addCase(fetchFilteredPlays.fulfilled, (state, action) => {
      // NO results
      if (action.payload.len === 0) {
        return {
          ...initialState,
          allPlayers: state.allPlayers,
          loading: state.loading,
          currentPlayer: state.currentPlayer,
          playersLoading: false,
          noResultsFound: true,
        };
      }

      state.noResultsFound = false;
      // sorts games avaialble games by pts scored
      let sortedList = Object.entries(action.payload.games_available).sort(
        function (a, b) {
          return b[1].playerpts - a[1].playerpts;
        }
      );
      state.gamesAvailable = action.payload.games_available;
      state.gamesAvailableSortedByPoints = sortedList;
      state.numberOfPlays = action.payload.len;
      state.pageCount = action.payload.page_count;
      state.playResults = action.payload.results;

      // if we have plays
      // set the currentshowing plays to the first page of results
      if (action.payload.len > 0) {
        state.currentPagePlays = action.payload.results[1];
        // first page, first play, URL
        state.currentUrl = state.playResults[1][0].url;

        // set game showing

        let currentGid = state.currentPagePlays[1].gid;
        let newGame = state.gamesAvailable[currentGid];
        state.gameShowing = { ...newGame, gid: currentGid };
      } else {
        state.noResultsFound = true;
      }

      // load stuff
      state.filteredSearchLoading = false;
    });
  },
});

export const {
  setPlayer,
  setPlayerByPid,
  setFiltersShowing,
  clearPlayerFilters,
  setMatchupId,
  setPlayerTeamId,
  updatePlayerFilter,
  setPlayIndex,
  handlePaginationChange,
} = playerSlice.actions;
export default playerSlice.reducer;
