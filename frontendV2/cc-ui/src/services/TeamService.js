import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

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
