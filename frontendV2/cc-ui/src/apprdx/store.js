import { configureStore } from "@reduxjs/toolkit";

import teamReducer from "../pages/teams/teamSlice";
import gameReducer from "../pages/game/gameSlice";

export const store = configureStore({
  reducer: {
    teams: teamReducer,
    game: gameReducer,
  },
});
