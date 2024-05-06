import * as React from "react";
import {
  Stack,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fade,
  Tooltip,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import InfoIcon from "@mui/icons-material/Info";
import GameList from "../../components/GameList";
import { useSelector } from "react-redux";

export default function TeamGameList(props) {
  const allSeasonsGameList = useSelector((state) => state.teams.gamesFound);
  const [renderedSeasonGamesList, setRenderedSeasonGamesList] = React.useState(
    []
  );
  const seasonsList = useSelector(
    (state) => state.teams.returnedAvailableSeasons
  );

  const seasonsListLength = seasonsList.length;
  const [currentSeasonIndex, setCurrentSeasonIndex] = React.useState(0);

  /**
   * Any time a new request is made and the length of seasons avaialable changes
   * Update to be at the start of the dict
   */
  React.useEffect(() => {
    setCurrentSeasonIndex(0);
    let seasonStr = seasonsList[0]; // most recent available szn str
    setRenderedSeasonGamesList(allSeasonsGameList[seasonStr]); // set the list of games showing to be newly found szn
  }, [seasonsListLength]);

  /**
   * handleSeasonChange fired, update to display the new season
   */
  React.useEffect(() => {
    let newSeasonStr = seasonsList[currentSeasonIndex];
    let newGameList = allSeasonsGameList[newSeasonStr];
    setRenderedSeasonGamesList(newGameList);
  }, [currentSeasonIndex]);

  /**
   * User clicked right/left arrow to change season displayed
   * Update index variable so useEffect fires
   */
  const handleSeasonChange = React.useCallback(
    (val) => {
      if (
        (currentSeasonIndex === seasonsListLength - 1 && val === 1) ||
        (currentSeasonIndex === 0 && val === 0)
      ) {
        return;
      }

      if (val === 1) {
        let newIndex = currentSeasonIndex + 1;
        setCurrentSeasonIndex(newIndex);
        return;
      }

      let newIndex = currentSeasonIndex - 1;
      setCurrentSeasonIndex(newIndex);
    },

    [currentSeasonIndex, seasonsListLength]
  );
  return (
    <>
      <Fade in={true} timeout={800}>
        <AppBar position='static' sx={{ borderRadius: 1 }}>
          <Toolbar sx={{ justifyContent: "right" }}>
            <Stack
              direction='row'
              alignItems={"center"}
              sx={{ mr: { xs: "7%", md: "25%" } }}>
              <IconButton onClick={() => handleSeasonChange(0)}>
                <KeyboardArrowLeftIcon color='info' />
              </IconButton>
              <Typography variant='body1' color='text.secondary'>
                Season: {seasonsList[currentSeasonIndex]}
              </Typography>

              <IconButton onClick={() => handleSeasonChange(1)}>
                <KeyboardArrowRightIcon color='info' />
              </IconButton>
            </Stack>

            <Tooltip
              title={
                "You are only seeing games from the " +
                seasonsList[currentSeasonIndex] +
                " season."
              }>
              <InfoIcon color='success' />
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Fade>
      {/* <Box sx={{ maxHeight: "70vh", overflow: "auto" }}> */}
      {renderedSeasonGamesList?.length === 0 && (
        <>
          <Stack
            direction='row'
            spacing={1}
            sx={{ alignItems: "center", padding: 1, ml: "30%" }}>
            <Tooltip>
              <InfoIcon />
            </Tooltip>
            <Typography>No results this season</Typography>
          </Stack>
        </>
      )}
      {seasonsList[currentSeasonIndex].length > 0 && (
        <GameList
          gameList={renderedSeasonGamesList}
          date={""}
          showDate={true}
        />
      )}
    </>
  );
}
