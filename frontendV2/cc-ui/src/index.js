import * as React from "react";
import * as ReactDOM from "react-dom/client";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  createHashRouter,
} from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./apprdx/store";

import Root from "./pages/root";
import ErrorPage from "./pages/error";
import Teams from "./pages/teams/teams";
import Game from "./pages/game/game";
import Date from "./pages/date/date";
import Player from "./pages/players/player";
import Home from "./pages/home/home";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "#5c6bc0",
      light: "#9fa8da",
      dark: "#3949ab",
    },
    isu: {
      blue: "#183260",
      contrastText: "#fff",

      red: "#bf4d40",
      yellow: "#f4dd57",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
});

// const router = createBroswerRouter()
const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/player/:pid",
        element: <Player />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },
      {
        path: "/game/:gid",
        element: <Game />,
      },
      {
        path: "/date/:dateurlstr",
        element: <Date />,
      },
      // {
      //   path: "/",
      //   element: <Home />,
      // },
      {
        path: "/",
        element: <Navigate to='/teams' replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
  // </React.StrictMode>
);

// export const baseRequestURL = "http://localhost:8000";
// export const baseRequestURL = "https://hnqd3g5g-8000.use.devtunnels.ms";

export const baseRequestURL = "https://nbaclipsite.onrender.com";
