import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseRequestURL } from "../index.js";
import { useDispatch, useSelector } from "react-redux";

const findTrueKeys = (dict) => {
  const trueKeys = [];

  for (const key in dict) {
    if (dict[key] === true) {
      trueKeys.push(key);
    }
  }

  // if all filters are selected
  // then that is the same as none being selected on the backend
  // will just not include and clause in sql query
  if (trueKeys.length === Object.keys(dict).length) return null;

  // if no options selected
  // return null to drop and clause
  if (trueKeys.length === 0) return null;

  return trueKeys;
};

export const fetchAllPlayers = createAsyncThunk(
  "player/fetchAllPlayers",
  async () => {
    return axios
      .get(baseRequestURL + "/players/allPlayers")
      .then((response) => response.data);
  }
);

export const fetchFilteredPlays = createAsyncThunk(
  "player/fetchFilteredPlays",
  async (options) => {
    return axios
      .post(baseRequestURL + "/players/plays2", options)
      .then((response) => response.data);
  }
);

export const fetchPlaysByGid = createAsyncThunk(
  "player/fetchPlaysByGid",
  async (options) => {
    return axios
      .post(baseRequestURL + "/players/plays2", options)
      .then((response) => response.data);
  }
);

export const fetchSamplePlays = createAsyncThunk(
  "player/fetchSamplePlays",
  async (player) => {
    return axios
      .post(baseRequestURL + "/players/samplePlays2", player)
      .then((response) => response.data);
  }
);

export const updatePlayerView = (pid) => {
  axios.post(baseRequestURL + "/players/player/view", { pid: pid });
};

/**
 * Helper to create request body for grabbing plays
 *
 * Ideally this will be cleaned up in the future to be cleaner
 *
 * @param {*} playerState - playerSlice state
 * @returns correct request body for fetch
 */
export const createSearchResults = (playerState) => {
  let options = playerState.filterAutoOptions;

  let quarterOptions = findTrueKeys(options["Quarter"]);
  let seasonTypeOptions = findTrueKeys(options["Season Type"]);
  let statTypeOptions = findTrueKeys(options["Stat Type"]);
  let homeAwayOptions = findTrueKeys(options["Court"]);

  let seasonsOptions = findTrueKeys(options["Season"]);

  // convert regular and playoffs to corresponding ints in db
  if (seasonTypeOptions !== null) {
    if (seasonTypeOptions[0] === "Regular Season") {
      seasonTypeOptions = [0];
    } else {
      seasonTypeOptions = [1];
    }
  }

  let teamIds = playerState.teamId.map((team) => team.id);
  let matchupIds = playerState.matchupTeamId.map((team) => team.id);

  // if searching for just a certain game
  // ie: clicked a game in games available
  if (playerState.gid !== null) {
    let requestOptions = {
      player_id: playerState.currentPlayer.playerID,
      team_id: null,
      matchup_team_id: null,
      limit: 1000,
      quarter: quarterOptions, // needs to accept arr in backend
      stat_type: statTypeOptions, // needs to accept arr in backend
      gid: playerState.gid,
      gtype: null,
      season: null,
      home_away: null,
    };
    return requestOptions;
  }

  let requestOptions = {
    player_id: playerState.currentPlayer.playerID,
    team_id: teamIds.length === 0 ? null : teamIds,
    matchup_team_id: matchupIds.length === 0 ? null : matchupIds,
    limit: 1000,
    quarter: quarterOptions, // needs to accept arr in backend
    stat_type: statTypeOptions, // needs to accept arr in backend
    gid: null,
    gtype: seasonTypeOptions,
    season: seasonsOptions,
    home_away: homeAwayOptions,
  };

  return requestOptions;
};
