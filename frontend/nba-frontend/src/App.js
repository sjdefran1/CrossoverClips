import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NbaHome from "./components/NbaHome.jsx"

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
          <NbaHome />
          </>
      </ThemeProvider>
    </>
  );
};

export default App;