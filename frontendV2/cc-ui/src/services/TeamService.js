import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseRequestURL } from "../index.js";

export const fetchTeamsAxios = createAsyncThunk("teams/fetchTeams", () => {
  return axios.get(baseRequestURL + "/teams").then((response) => response.data);
});

export const fetchGamesByTeam = createAsyncThunk(
  "teams/fetchGamesByTeam",
  async (data) => {
    return axios
      .post(baseRequestURL + "/gamesByTeam", data)
      .then((response) => response.data);
  }
);

export const incrementGameViewCount = createAsyncThunk(
  "teams/incrementGameViewCount",
  async (id) => {
    let data = {
      gid: id,
    };
    return axios
      .post(baseRequestURL + "/updateViewCount", data)
      .then((response) => {});
  }
);
