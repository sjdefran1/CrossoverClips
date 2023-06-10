import * as React from "react";
import {
  Stack,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fade,
  Tooltip,
  Alert,
  Box,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import InfoIcon from "@mui/icons-material/Info";
import GameList2 from "../GameList2";

export default function TeamGameList(props) {
  const [currentSeasonIndex, setCurrentSeasonIndex] = React.useState(0);
  const [seasonsListLength, setSeasonsListLength] = React.useState(0);
  const [currentSeasonGamesList, setCurrentSeasonGamesList] = React.useState(
    []
  );

  /**
   * Any time a new request is made and the length of seasons avaialable changes
   * Update to be at the start of the dict
   */
  React.useEffect(() => {
    setSeasonsListLength(props?.seasonsList?.length);
    setCurrentSeasonIndex(0);
    let seasonStr = props?.seasonsList[0];
    setCurrentSeasonGamesList(props.gameList[seasonStr]);
  }, [props?.seasonsList?.length]);

  /**
   * handleSeasonChange fired, update to display the new season
   */
  React.useEffect(() => {
    setSeasonsListLength(props?.seasonsList?.length);

    // console.log("fired");
    let newSeasonStr = props?.seasonsList[currentSeasonIndex];
    let newGameList = props?.gameList[newSeasonStr];
    setCurrentSeasonGamesList(newGameList);
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
                Season: {props?.seasonsList[currentSeasonIndex]}
              </Typography>

              <IconButton onClick={() => handleSeasonChange(1)}>
                <KeyboardArrowRightIcon color='info' />
              </IconButton>
            </Stack>

            <Tooltip
              title={
                "You are only seeing games from the " +
                props?.seasonsList[currentSeasonIndex] +
                " season."
              }>
              <InfoIcon color='success' />
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Fade>
      {/* <Box sx={{ maxHeight: "70vh", overflow: "auto" }}> */}
      {currentSeasonGamesList?.length === 0 && (
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
      {currentSeasonGamesList?.length > 0 && (
        <GameList2
          gameList={currentSeasonGamesList}
          date={""}
          showDate={true}
        />
      )}

      {/* </Box> */}
    </>
  );
}
