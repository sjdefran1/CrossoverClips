import * as React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Avatar,
  Button,
  Chip,
  Divider,
  Stack,
  Grid,
  Pagination,
  Fade,
} from "@mui/material";
import "./chip.css";

export default function GamesAvailable(props) {
  const [slicedGamesShowing, setSlicedGamesShowing] = React.useState([]);
  const [usePagination, setUsePagination] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // When we change pages we need to update the games showing
  React.useEffect(() => {
    let newStart = page === 1 ? 0 : page * 10;
    let newEnd = page === 1 ? 10 : page * 10 + 10;

    if (newEnd > props.gamesAvailable.length) {
      newEnd = props.gamesAvailable.length;
    }
    setSlicedGamesShowing(props.gamesAvailable.slice(newStart, newEnd));
  }, [page]);

  // determines color of chip based on points scored
  const getPointsString = (points) => {
    if (points >= 70) {
      return "#ce93d8";
    } else if (points >= 60) {
      return "#f6a5c0";
    } else if (points >= 50) {
      return "#4dd0e1";
    } else if (points >= 40) {
      return "#f27573";
    } else if (points >= 30) {
      return "#ef5350";
    } else if (points >= 20) {
      return "#aed581";
    } else if (points >= 10) {
      return "#8561c5";
    } else {
      return "default";
    }
  };

  /**
   * Updates are games available and pagination settings
   * each time a new search is made / component loads
   */
  React.useEffect(() => {
    // if we have more than 8 games we need to use paginaton
    if (props.gamesAvailable.length > 8) {
      setUsePagination(true);
      setPageCount(Math.floor(props.gamesAvailable.length / 8));
      setSlicedGamesShowing(props.gamesAvailable.slice(0, 8));
    } else {
      setUsePagination(false);
      setSlicedGamesShowing(props.gamesAvailable);
    }
  }, [props.gamesAvailable]);

  console.log(props.gameShowing);
  return (
    <>
      <Paper
        // elevation={15}

        variant='outlined'
        sx={{
          bgcolor: "#333",
          mt: 1,
        }}>
        <Typography>Results</Typography>
      </Paper>
      <Paper sx={{ maxHeight: "60vh", overflow: "auto" }}>
        <List>
          {slicedGamesShowing &&
            slicedGamesShowing.map((game) => (
              <React.Fragment key={game[0]}>
                <Divider />
                {game[0] === props.gameShowing[0] && (
                  <Paper
                    variant='outlined'
                    sx={{
                      bgcolor: "#90caf9",
                      minWidth: "2px",
                    }}></Paper>
                )}
                <Fade in={true}>
                  <Paper
                    sx={{
                      borderColor: "#90caf9",
                    }}>
                    <ListItem>
                      {/* props.getPlaysByGameID(props.gameShowing[0]) */}
                      <ListItemButton
                        onClick={() => props.getPlaysByGameID(game[0])}
                        sx={{}}>
                        <Grid container>
                          <Grid item sm={12} md={6}>
                            <Stack
                              direction={"row"}
                              spacing={1}
                              justifyContent={"left"}
                              alignItems={"center"}>
                              <Avatar
                                src={
                                  "https://cdn.nba.com/logos/nba/" +
                                  game[1].atid +
                                  "/primary/L/logo.svg"
                                }
                              />
                              <Typography variant='subtitle2'>
                                {game[1].matchupstr}
                              </Typography>

                              <Avatar
                                src={
                                  "https://cdn.nba.com/logos/nba/" +
                                  game[1].htid +
                                  "/primary/L/logo.svg"
                                }
                              />

                              <Chip
                                size='small'
                                color='default'
                                variant='filled'
                                label={game[1].sznstr}
                              />
                            </Stack>
                          </Grid>

                          {/* <Typography mr={1} variant='subtitle2'>
                          See this game only
                        </Typography> */}
                          <Grid item sm={12} md={6}>
                            <Stack
                              direction={"row"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              spacing={1}>
                              <Chip
                                size='small'
                                variant='outlined'
                                label={game[1].ast_count + " AST"}
                              />
                              <Chip
                                className={
                                  game[1].playerpts >= 40 ? "icon" : ""
                                }
                                sx={{
                                  bgcolor: getPointsString(game[1].playerpts),
                                  color: "black",
                                }}
                                label={game[1].playerpts + " PTS"}
                              />
                              <Chip
                                size='small'
                                variant='outlined'
                                label={game[1].blk_count + " BLK"}
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                    </ListItem>
                  </Paper>
                </Fade>
                {game[0] === props.gameShowing[0] && (
                  <Paper
                    variant='outlined'
                    sx={{
                      bgcolor: "#90caf9",
                      minWidth: "2px",
                    }}></Paper>
                )}
              </React.Fragment>
            ))}
        </List>

        <Grid item xs={12}>
          {usePagination && (
            <Pagination
              // sx={{ justifyContent: "center" }}
              page={page}
              count={pageCount}
              onChange={handlePageChange}
            />
          )}
        </Grid>

        {/* </Grid> */}
      </Paper>
    </>
  );
}
