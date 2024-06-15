import * as React from "react";
import {
  Stack,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fade,
  Tooltip,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import InfoIcon from "@mui/icons-material/Info";
import GameList from "../../components/GameList";
import { useSelector } from "react-redux";

/**
 * Wrapper for GamesList coomponent
 * Basically provides the toolbar to switch between seasons being currently rendered
 * And then renders the GameList passing in only the selected seasons games
 *
 * @param {*} props
 * @returns
 */
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
        <AppBar position='static' sx={{ borderRadius: 1, mt: 1 }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Stack direction='row' alignItems={"center"}>
              <IconButton
                color={currentSeasonIndex === 0 ? "disabled" : "info"}
                disabled={currentSeasonIndex === 0}
                onClick={() => handleSeasonChange(0)}>
                <KeyboardArrowLeftIcon />
              </IconButton>

              <Chip
                color='info'
                variant='outlined'
                label={seasonsList[currentSeasonIndex]}
              />

              <IconButton
                color={
                  currentSeasonIndex === seasonsListLength ? "disabled" : "info"
                }
                disabled={currentSeasonIndex === seasonsListLength - 1}
                onClick={() => handleSeasonChange(1)}>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Stack>
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

      {/* Where the actual games are handled */}
      {seasonsList[currentSeasonIndex].length > 0 && (
        <>
          <Grid container sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <GameList
              gameList={renderedSeasonGamesList}
              date={""}
              showDate={true}
            />
          </Grid>
        </>
      )}
    </>
  );
}
