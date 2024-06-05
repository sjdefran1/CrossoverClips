import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBasicGameInfo,
  fetchPlayByPlayByGameId,
} from "../../services/GameService";
import { setFullscreenVideo } from "../players/playerSlice";
import { handlePlayView } from "../../services/PlayService";

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

  // video player func
  currentlyRenderedPlays: [], // Rendered on screen, updates on quarter/filter change
  currentPlayIndex: 0,
  currentUrl: "",
  fullScreenVideo: false,
  videoPlayerEnabled: false,
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

      // set currently rendered plays based on if we have
      // ids selected
      if (state.filteredPlayers.length === 0) {
        state.currentlyRenderedPlays = state.currentShowingPlays.filter(
          (play) => play.quarter === state.quarterSelected
        );
      } else {
        state.currentlyRenderedPlays = state.currentShowingPlays.filter(
          (play) =>
            play.quarter === state.quarterSelected &&
            state.filteredPlayers.includes(play.playerID)
        );
      }
    },
    clearPlayerFilter(state) {
      state.filteredPlayers = initialState.filteredPlayers;
      state.currentlyRenderedPlays = state.currentShowingPlays.filter(
        (play) => play.quarter === state.quarterSelected
      );
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

      if (state.filteredPlayers.length > 0) {
        state.currentlyRenderedPlays = state.currentShowingPlays.filter(
          (play) =>
            play.quarter === state.quarterSelected &&
            state.filteredPlayers.includes(play.playerID)
        );
      } else {
        state.currentlyRenderedPlays = state.currentShowingPlays.filter(
          (play) => play.quarter === state.quarterSelected
        );
      }
    },
    handleStatChange(state, action) {
      state.currentlySelectedStatType = action.payload;
      state.currentShowingPlays = initialState.currentShowingPlays;
      state.currentShowingPlays = state.allStatTypePlayDict[action.payload];
      if (state.filteredPlayers.length > 0) {
        state.currentlyRenderedPlays = state.currentShowingPlays.filter(
          (play) =>
            play.quarter === state.quarterSelected &&
            state.filteredPlayers.includes(play.playerID)
        );
      } else {
        state.currentlyRenderedPlays = state.currentShowingPlays.filter(
          (play) => play.quarter === state.quarterSelected
        );
      }
    },
    setCurrentlyRenderedPlays(state, action) {
      state.currentlyRenderedPlays = action.payload;
    },
    setGamePlayIndex(state, action) {
      state.currentPlayIndex = action.payload;
      // state.currentlyRenderedPlays[action.payload].views += 1;

      let currentPlayId = state.currentlyRenderedPlays[action.payload].playid;
      let tempIndex = state.currentShowingPlays.findIndex(
        (play) => play.playid === currentPlayId
      );
      state.currentShowingPlays[tempIndex].views += 1;
    },
    incrementGamePlayIndex(state, action) {
      let newIndex = state.currentPlayIndex + action.payload;
      // forwards
      if (newIndex > state.currentlyRenderedPlays.length - 1) {
        newIndex = 0;
        if (state.quarterSelected + 1 <= state.numberOfQuarters) {
          state.currentPlayIndex = 0;
          state.quarterSelected += 1;
        } else {
          // out of plays
        }
      }

      // backwards
      else if (newIndex < 0) {
        newIndex = 0;
        if (state.quarterSelected - 1 >= 1) {
          state.currentPlayIndex = 0;
          state.quarterSelected -= 1;
        }
        // out of quarters/plays
        else {
        }
      }
      // dont need to change quarters
      else {
        state.currentPlayIndex = newIndex;
      }
      let currentPlayId = state.currentlyRenderedPlays[newIndex].playid;
      let tempIndex = state.currentShowingPlays.findIndex(
        (play) => play.playid === currentPlayId
      );

      state.currentShowingPlays[tempIndex].views += 1;
      state.currentUrl = state.currentShowingPlays[state.currentPlayIndex].url;
      handlePlayView(state.currentlyRenderedPlays[newIndex]);
    },
    setGameFullscreenVideo(state, action) {
      state.fullScreenVideo = action.payload;
    },
    enableVideoPlayer(state) {
      state.videoPlayerEnabled = !state.videoPlayerEnabled;
      state.currentShowingPlays[0].views += 1;
      handlePlayView(state.currentShowingPlays[0]);
    },
  },
  extraReducers: (builder) => {
    /**
     * Basic Game Info
     */

    // This is IMPORTANT, basically any time we are loading into a new game page
    // we clear any previous set state from users looking at old games
    // without this weird behavior comes into play with old players from different games being filtered
    // / old plays showing up
    builder.addCase(fetchBasicGameInfo.pending, () => {
      return { ...initialState };
    });
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
      state.currentlyRenderedPlays = state.currentShowingPlays.filter(
        (play) => play.quarter === 1
      );
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
  setCurrentlyRenderedPlays,
  incrementGamePlayIndex,
  setGameFullscreenVideo,
  enableVideoPlayer,
  setGamePlayIndex,
} = gameSlice.actions;
export default gameSlice.reducer;
