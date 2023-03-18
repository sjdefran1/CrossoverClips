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
import GameList2 from "../GameList2";

export default function TeamGameList(props) {
  const [currentSeason, setCurrentSeason] = React.useState(0);
  const [seasonsListLength, setSeasonsListLength] = React.useState(0);
  const [seasonsList, setSeasonsList] = React.useState(
    [
      "2014-15",
      "2015-16",
      "2016-17",
      "2017-18",
      "2018-19",
      "2020-21",
      "2021-22",
      "2022-23",
    ].reverse()
  );

  const [currentSeasonGames, setCurrentSeasonGames] = React.useState([]);

  React.useEffect(() => {
    setSeasonsListLength(seasonsList.length);
    if (props.selectedSeasonsParent.length > 0) {
      setSeasonsListLength(props.selectedSeasonsParent.length);
      setSeasonsList(props.selectedSeasonsParent);
      setCurrentSeason(0);
    }

    setCurrentSeasonGames(
      props.gameList.filter(
        (game) => game.season_str === props.selectedSeasonsParent[currentSeason]
      )
    );
  }, [props.selectedSeasonsParent]);

  React.useEffect(() => {
    setCurrentSeasonGames(
      props.gameList.filter(
        (game) => game.season_str === seasonsList[currentSeason]
      )
    );
    console.log(currentSeasonGames);
  }, [currentSeason, props.gameList]);

  const handleSeasonChange = React.useCallback(
    (val) => {
      if (
        (currentSeason === seasonsListLength - 1 && val === 1) ||
        (currentSeason === 0 && val === 0)
      ) {
        return;
      }

      if (val === 1) {
        setCurrentSeason(currentSeason + 1);
        return;
      }

      setCurrentSeason(currentSeason - 1);
    },
    [currentSeason, seasonsListLength]
  );
  return (
    <>
      <Fade in={true}>
        <AppBar position='static' sx={{ borderRadius: 1 }}>
          <Toolbar sx={{ justifyContent: "right" }}>
            <Stack direction='row' alignItems={"center"} sx={{ mr: "25%" }}>
              <IconButton onClick={() => handleSeasonChange(0)}>
                <KeyboardArrowLeftIcon color='info' />
              </IconButton>
              <Typography variant='body1' color='text.secondary'>
                Season: {seasonsList[currentSeason]}
              </Typography>

              <IconButton onClick={() => handleSeasonChange(1)}>
                <KeyboardArrowRightIcon color='info' />
              </IconButton>
            </Stack>

            <Tooltip
              title={
                "You are only seeing games from the " +
                seasonsList[currentSeason] +
                " season."
              }>
              <InfoIcon color='success' />
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Fade>
      {/* <Box sx={{ maxHeight: "70vh", overflow: "auto" }}> */}
      <GameList2 gameList={currentSeasonGames} date={""} showDate={true} />
      {/* </Box> */}
    </>
  );
}
