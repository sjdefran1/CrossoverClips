import * as React from "react";
import { useParams } from "react-router-dom";
import { withRouter } from "react-router";
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
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

export default function GameDetails(props) {
  const { id } = useParams();
  const { date } = useParams();
  const [playByPlay, setPlayByPlay] = React.useState([]);
  const [currentQuarter, setCurrentQuarter] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const submitMessageAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      gameID: e.toString(),
      date: date,
    };
    axios
      .post("http://localhost:8000/playByPlay", data)
      .then((response) => {
        console.log(response.data);
        setPlayByPlay(response.data);
        //const data = JSON.parse(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false); // Set isLoading back to false once the response is received
      });
  };

  const handleQuarterChangeLeft = (val) => {
    if (currentQuarter === 1) {
      return;
    }
    setCurrentQuarter(currentQuarter - 1);
  };

  const handleQuarterChangeRight = (val) => {
    if (currentQuarter === 4) {
      return;
    }
    setCurrentQuarter(currentQuarter + 1);
  };

  React.useEffect(() => {
    submitMessageAxios(id);
    console.log("useeffect");
  }, []);

  return (
    <>
      <Container maxWidth='lg'>
        <Grid container>
          <Grid item xs={6}>
            <p>{id}</p>
            <p>{date}</p>
          </Grid>
          <Grid item xs={6}>
            <AppBar position='static'>
              <Toolbar sx={{ justifyContent: "center" }}>
                <IconButton onClick={handleQuarterChangeLeft}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography>Quarter: {currentQuarter}</Typography>
                <IconButton onClick={handleQuarterChangeRight}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Stack spacing={1} sx={{ maxHeight: "70vh", overflow: "auto" }}>
              {/* Loading */}
              {isLoading && (
                <Stack sx={{ justifyContent: "center" }}>
                  <CircularProgress />
                </Stack>
              )}

              {/* Request Recieved, Map plays to list */}
              {!isLoading &&
                playByPlay
                  .filter((play) => play.quarter === currentQuarter)
                  .map((play) => (
                    <>
                      <nav aria-label='main mailbox folders'>
                        <Link target='_blank' rel='noreferrer' href={play.url}>
                          <List>
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon>
                                  <Avatar
                                    src={
                                      "https://cdn.nba.com/logos/nba/" +
                                      play.teamID +
                                      "/primary/L/logo.svg"
                                    }
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={play.description}
                                  secondary={
                                    "Home " +
                                    play.scoreHome +
                                    "-" +
                                    play.scoreAway +
                                    " Away"
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </Link>
                      </nav>
                      <Divider />
                    </>
                  ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
