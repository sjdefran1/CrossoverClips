import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route, HashRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
// import Main from "./components/Main.jsx";
import Main2 from "./components/Main2.jsx";
import GameDetails from "./components/GameDetails/GameDetails.jsx";
// import TestMarkDown from "./components/TestMarkDown.jsx";
// import TopBar from "./components/TopBar.jsx";

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

const App = () => {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <>
          {/* <TopBar /> */}
          {/* <BrowserRouter> */}

          <HashRouter>
            <Routes>
              <Route exact path='/' element={<Main2 />} />
              <Route exact path='/games/:date/:id' element={<GameDetails />} />
              <Route exact path='/byTeam/:id' element={<Main2 />} />
              <Route exact path='/byTeam/:id1/:id2' element={<Main2 />} />
              <Route exact path='/byDate/' element={<Main2 />} />
              <Route exact path='/byDate/:date' element={<Main2 />} />
              {/* <Route exact path='/howto' element={<TestMarkDown />} /> */}
            </Routes>
          </HashRouter>
          {/* </BrowserRouter> */}
        </>
      </ThemeProvider>
    </>
  );
};

//export const reqString = "https://nbaclipfinder4-1-u4961891.deta.app/";

export const reqString = "https://nbaclipsite.onrender.com/";
//export const reqString = "http://localhost:8000/";

export default App;
