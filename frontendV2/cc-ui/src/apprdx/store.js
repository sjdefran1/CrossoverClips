import { configureStore } from "@reduxjs/toolkit";

import teamReducer from "../pages/teams/teamSlice";

export const store = configureStore({
  reducer: {
    teams: teamReducer,
  },
});
