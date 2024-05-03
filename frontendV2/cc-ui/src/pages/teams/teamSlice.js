import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import TeamService from "../../services/TeamService";
import axios from "axios";

const initialState = {
  loading: true,
  teamDetailsList: [], // will hit get_teams
  //   selectedTeams: [null, null], // [{celtics details}, {warriors details}]
  selectedTeamOne: null,
  selectedTeamTwo: null,
  selectedTeamIds: [null, null],
  disableTeamSelect: false, // set true when 2 teams selected
};

export const fetchTeamsAxios = createAsyncThunk("teams/fetchUsers", () => {
  return axios
    .get("https://nbaclipsite.onrender.com/teams")
    .then((response) => response.data);
});

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
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
  },

  // Handles Network Request Loading States
  extraReducers: (builder) => {
    builder.addCase(fetchTeamsAxios.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTeamsAxios.fulfilled, (state, action) => {
      state.loading = false;
      state.teamDetailsList = action.payload;
      console.log(action.payload.map((dict) => [dict.team_id, dict.team_name]));
    });
  },
});

export const { selectTeam, deselectTeam } = teamSlice.actions;
export default teamSlice.reducer;
