import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTeamsAxios = createAsyncThunk("teams/fetchTeams", () => {
  return axios
    .get("https://nbaclipsite.onrender.com/teams")
    .then((response) => response.data);
});

export const fetchGamesByTeam = createAsyncThunk(
  "teams/fetchGamesByTeam",
  async (data) => {
    return axios
      .post("https://nbaclipsite.onrender.com/gamesByTeam", data)
      .then((response) => response.data);
  }
);

export const incrementGameViewCount = createAsyncThunk(
  "teams/incrementGameViewCount",
  async (id) => {
    let data = {
      game_id: id,
    };
    return axios
      .post("https://nbaclipsite.onrender.com/updateViewCount", data)
      .then((response) => {});
  }
);
