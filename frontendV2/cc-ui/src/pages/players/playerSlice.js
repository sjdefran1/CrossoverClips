import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPlayers,
  fetchFilteredPlays,
  fetchPlaysByGid,
  fetchSamplePlays,
} from "../../services/PlayerService";
import { handlePlayView } from "../../services/PlayService";

const initialState = {
  // loading states
  loading: true, // first overall load
  filteredSearchLoading: false, // submitted search
  playersLoading: true, // searchbar retrieving players
  samplePlaysLoading: true,
  samplePlaysShowing: true,
  playerNotFound: false, // pid from url not found
  filtersShowing: true,
  currentPlayer: {},
  fullScreenVideo: false,
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
  pageCount: 0, // # of pages of plays
  numberOfPlays: 0, // overall possible plays, will be used for offset
  playIndex: 0, // index of current page plays "currently viewing"
  currentPage: 1,
  endOfResultsReached: false, // true when viewed last possible clip returned
  currentPagePlays: [], // rendered plays
  currentUrl: "", // url in vidplayer
  gameShowing: {},

  // results
  noResultsFound: false,
  playResults: [], // pages of plays {1: [..], 2: [..]}
  gamesAvailable: {}, // possible games {gid: {game}}
  gamesAvailableSortedByPoints: [],

  // all players for search bar
  allPlayers: [],
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer(state, action) {
      return {
        ...initialState,
        currentPlayer: action.payload,
        allPlayers: state.allPlayers,
        playersLoading: false,
        loading: state.loading,
      };
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
    setPlayerGid(state, action) {
      state.gid = action.payload;
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
      state.endOfResultsReached = false;
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

    incrementPlayIndex(state, action) {
      let newIndex = state.playIndex + action.payload;
      // need to move onto next page
      if (newIndex > state.currentPagePlays.length - 1) {
        // if the new page to load exists
        if (state.currentPage + 1 <= state.pageCount) {
          // reset index for new page
          state.playIndex = 0;
          // update next pages first view
          state.currentPagePlays[0].views += 1;
          // passing in null as "event" ?? wut, then next page
          state.currentPage += 1;
          // need to update in playResults as well
          state.playResults[state.currentPage][0].views += 1;
        } else {
          state.endOfResultsReached = true;
          return;
        }
        // need to move back a page
        // same process as above
      } else if (newIndex < 0) {
        if (state.currentPage - 1 > 1) {
          state.playIndex = 0;
          state.currentPagePlays[0].views += 1;
          state.currentPage -= 1;
          state.playResults[state.currentPage][0].views += 1;
        }
      } else {
        state.playIndex = newIndex;
        state.currentPagePlays[newIndex].views += 1;
        state.playResults[state.currentPage][newIndex].views += 1;
        // console.log(state.currentPagePlays[newIndex].views);
      }
      // state.currentPagePlays[newIndex].views += 1;
      state.endOfResultsReached = false;
      state.currentPagePlays = state.playResults[state.currentPage];
      state.currentUrl = state.currentPagePlays[state.playIndex].url;
      handlePlayView(state.currentPagePlays[state.playIndex]);
    },

    setFullscreenVideo(state, action) {
      state.fullScreenVideo = action.payload;
    },

    incrementDownloadCount(state, action) {
      let play = state.currentPagePlays.find(
        (play) =>
          play.url === action.payload.url && play.ptype === action.payload.ptype
      );

      console.log(play);
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
      state.filteredSearchLoading = true;
      state.filtersShowing = false;
      state.samplePlaysShowing = false;
    });

    /**
     * Responsible for setting most of the state
     */
    builder.addCase(fetchFilteredPlays.fulfilled, (state, action) => {
      // NO results
      if (action.payload.len === 0) {
        return {
          ...initialState,
          samplePlaysShowing: false,
          filterAutoOptions: state.filterAutoOptions,
          teamId: state.teamId,
          matchupTeamId: state.matchupTeamId,
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
    builder.addCase(fetchPlaysByGid.pending, (state) => {
      //TODO
      // Loading States
      state.filteredSearchLoading = true;
      state.filtersShowing = false;
    });

    /**
     * Triggered when game selected from games available
     */
    builder.addCase(fetchPlaysByGid.fulfilled, (state, action) => {
      state.endOfResultsReached = false;
      state.numberOfPlays = action.payload.len;
      state.pageCount = action.payload.page_count;
      state.playResults = action.payload.results;

      // set the currentshowing plays to the first page of results
      state.currentPagePlays = action.payload.results[1];
      // first page, first play, URL
      state.currentUrl = state.playResults[1][0].url;
      state.playIndex = 0;
      // set game showing
      let newGame = state.gamesAvailable[state.gid];
      state.gameShowing = { ...newGame, gid: state.gid };

      // reset this to null so if user submits a new search
      // its not only for that game
      state.gid = null;
      // load stuff
      state.filteredSearchLoading = false;
    });

    /**
     * Sample plays
     */
    builder.addCase(fetchSamplePlays.pending, (state) => {
      state.samplePlaysLoading = true;
    });
    builder.addCase(fetchSamplePlays.fulfilled, (state, action) => {
      state.noResultsFound = false;
      state.samplePlaysLoading = false;
      state.endOfResultsReached = false;
      state.numberOfPlays = action.payload.len;
      state.pageCount = action.payload.page_count;
      state.playResults = action.payload.results;

      // set the currentshowing plays to the first page of results
      state.currentPagePlays = action.payload.results[1];
      // first page, first play, URL
      state.currentUrl = action.payload.results[1][0].url;
      state.playIndex = 0;

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
  incrementPlayIndex,
  setFullscreenVideo,
  setPlayerGid,
  incrementDownloadCount,
} = playerSlice.actions;
export default playerSlice.reducer;
