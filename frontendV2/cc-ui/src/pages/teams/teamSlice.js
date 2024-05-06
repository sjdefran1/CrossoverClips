/**
 * Handles all data manipulations and state for the search by team dashboard
 */

import { createSlice } from "@reduxjs/toolkit";
import { fetchTeamsAxios, fetchGamesByTeam } from "../../services/TeamService";

const initialState = {
  loading: true,
  resultsLoading: true, // loading var for when request goes out
  gamesFound: [], // game list returned when user submits a search
  returnedAvailableSeasons: [], // backend only returns seasons that have games for this search!
  teamDetailsList: [], // will hit get_teams
  selectedTeamOne: null,
  selectedTeamTwo: null,
  selectedTeamIds: [null, null], // selected team id's for if checkbox should be disabled in mathcupDisplay
  disableTeamSelect: false, // set true when 2 teams selected
  searchOptions: {
    Seasons: {
      "2023-24": true,
      "2022-23": true,
      "2021-22": true,
      "2020-21": true,
      "2019-20": true,
      "2018-19": true,
      "2017-18": true,
      "2016-17": true,
      "2015-16": true,
      "2014-15": true,
    },
    "Season Type": {
      "Regular Season": false,
      Playoffs: false,
    },
    "Win or Loss": {
      Win: false,
      Loss: false,
    },
    "Game Location": {
      Home: false,
      Away: false,
    },
  },
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    /**
     * Used to Choose Teams in Team Dashboard
     * Can Select up to two teams
     * @param {*} state
     * @param {*} action id of newly selected team
     * @returns
     */
    selectTeam(state, action) {
      // 1st Team Not Selected
      if (!state.selectedTeamOne) {
        // find new team from full team list
        let firstTeam = state.teamDetailsList.find(
          (team) => team.id === action.payload
        );
        state.selectedTeamOne = firstTeam;
        state.selectedTeamIds[0] = firstTeam.id;
        // set the second team (vs or matchup)
      } else {
        if (action.payload === state.selectedTeamOne.id) return; // don't allow selecting same team twice
        let secondTeam = state.teamDetailsList.find(
          (team) => team.id === action.payload
        );
        state.selectedTeamTwo = secondTeam;
        state.selectedTeamIds[1] = secondTeam.id;
        state.disableTeamSelect = true;
      }
    },
    /**
     * Removes team selection, if there is another team selected still it is swithced to
     * selectedTeamOne
     * @param {*} state
     * @param {*} action
     */
    deselectTeam(state, action) {
      if (state.selectedTeamOne.id === action.payload) {
        // unselecting first choice
        // make second choice team one if applicable
        state.selectedTeamOne = state.selectedTeamTwo;
        state.selectedTeamIds[0] = state.selectedTeamTwo?.id;
        state.selectedTeamTwo = null;
        state.selectedTeamIds[1] = null;
      } else {
        state.selectedTeamTwo = null; // they are unselecting section option, make it null
        state.selectedTeamIds[1] = null;
      }
      state.disableTeamSelect = false; // can now pick another team, reanable checkboxes
    },
    /**
     * Changes search options for finding by teams
     * seasons, game location, etc
     * @param {*} state
     * @param {*} action {title: 'Season', valueToChange: '2017-18'}
     */
    updateTeamFilter(state, action) {
      // get if the selected option was true or false, then change it to the opposite
      // {
      //  action.payload.title: {
      //      action.payload.valueToChange: false/true
      //      },
      //  ...
      // }
      let oldVal =
        state.searchOptions[action.payload.title][action.payload.valueToChange];
      state.searchOptions[action.payload.title][action.payload.valueToChange] =
        !oldVal;
    },
  },

  // Handles Network Request Loading States
  extraReducers: (builder) => {
    /**
     * FetchTeams
     */
    builder.addCase(fetchTeamsAxios.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTeamsAxios.fulfilled, (state, action) => {
      state.loading = false;
      state.teamDetailsList = action.payload;
      console.log(action.payload.map((dict) => [dict.team_id, dict.team_name]));
    });
    /**
     * FetchGamesByTeam
     */
    builder.addCase(fetchGamesByTeam.pending, (state) => {
      state.resultsLoading = true;
    });
    builder.addCase(fetchGamesByTeam.fulfilled, (state, action) => {
      state.resultsLoading = false;
      if (action.payload === "no games") {
        state.gamesFound = [];
        state.returnedAvailableSeasons = [];
        return;
      }
      state.gamesFound = action.payload.games_dict;
      state.returnedAvailableSeasons = action.payload.seasons_list;
    });
  },
});

export const { selectTeam, deselectTeam, updateTeamFilter } = teamSlice.actions;
export default teamSlice.reducer;
