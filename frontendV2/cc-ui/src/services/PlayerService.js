import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseRequestURL } from "../index.js";

export const fetchAllPlayers = createAsyncThunk(
  "player/fetchAllPlayers",
  async () => {
    return axios
      .get(baseRequestURL + "/players/allPlayers")
      .then((response) => response.data);
  }
);
