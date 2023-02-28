import * as React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemButton,
  Link,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";

//const project = projects[0];
export default function GameDash(props) {
  const { id } = useParams();
  const { date } = useParams();
  const [gameInfoIsLoading, setGameInfoIsLoading] = React.useState(true);
  const [gameInfo, setGameInfo] = React.useState({});

  const getGameInfoAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      gameID: e.toString(),
      date: date,
    };
    axios
      .post("http://localhost:8000/gameInfo", data)
      .then((response) => {
        setGameInfo(response.data);
        //console.log(response.data);
        //const data = JSON.parse(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setGameInfoIsLoading(false); // Set isLoading back to false once the response is received
      });
  };

  React.useEffect(() => {
    getGameInfoAxios(id);
    console.log("useeffect");
  }, []);

  return (
    <>
      {gameInfoIsLoading && (
        <Stack sx={{ justifyContent: "center" }}>
          <br></br>
          <CircularProgress sx={{ ml: "50%" }} />
        </Stack>
      )}
      {!gameInfoIsLoading && (
        <>
          <Paper sx={{ borderRadius: 2 }}>
            <br></br>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Stack
                  direction='column'
                  spacing={0.5}
                  sx={{ alignItems: "center", justifyContent: "center" }}>
                  <Avatar
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      gameInfo.away_teamID +
                      "/primary/L/logo.svg"
                    }
                    sx={{ width: 100, height: 100 }}
                  />
                  <Typography variant='h6'>{gameInfo.away_city}</Typography>
                  <Typography variant='h7' color='text.secondary'>
                    {gameInfo.away_name}
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ alignItems: "center", justifyContent: "center" }}>
                <br></br>
                <br></br>
                <Stack
                  direction='row'
                  spacing={5}
                  sx={{ alignItems: "center", justifyContent: "center" }}>
                  <Typography variant='h4' sx={{}}>
                    {gameInfo.away_pts}
                  </Typography>
                  <Typography variant='h4' sx={{}}>
                    -
                  </Typography>
                  <Typography variant='h4' sx={{}}>
                    {gameInfo.home_pts}
                  </Typography>
                </Stack>
                <Stack
                  direction='column'
                  paddingTop
                  sx={{ alignItems: "center", justifyContent: "center" }}>
                  <Typography variant='body1' color='text.secondary'>
                    Final
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {gameInfo.away_tri} @ {gameInfo.home_tri}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack
                  direction='column'
                  spacing={0.5}
                  sx={{ alignItems: "center", justifyContent: "center" }}>
                  <Avatar
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      gameInfo.home_teamID +
                      "/primary/L/logo.svg"
                    }
                    sx={{ width: 100, height: 100 }}
                  />
                  <Typography variant='h6'>{gameInfo.home_city}</Typography>
                  <Typography variant='h7' color='text.secondary'>
                    {gameInfo.home_name}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <br></br>
          </Paper>
        </>
      )}
    </>
  );
}
