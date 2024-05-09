import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseRequestURL } from "../index.js";

export const fetchBasicGameInfo = createAsyncThunk(
  "game/fetchBasicGameInfo",
  async (data) => {
    return axios
      .post(baseRequestURL + "/getGameByID", data)
      .then((response) => response.data);
  }
);

export const fetchPlayByPlayByGameId = createAsyncThunk(
  "game/fetchPlayByPlayByGameId",
  async (data) => {
    return axios
      .post(baseRequestURL + "/pgres/playByPlay", data)
      .then((response) => response.data);
  }
);

export const fetchGamesByDate = createAsyncThunk(
  "date/fetchGamesByDate",
  async (data) => {
    data = {
      value: data,
    };
    return axios
      .post(baseRequestURL + "/date", data)
      .then((response) => response.data);
  }
);
