import { configureStore } from "@reduxjs/toolkit";

import teamReducer from "../pages/teams/teamSlice";
import gameReducer from "../pages/game/gameSlice";
import dateReducer from "../pages/date/dateSlice";
export const store = configureStore({
  reducer: {
    teams: teamReducer,
    game: gameReducer,
    date: dateReducer,
  },
});
