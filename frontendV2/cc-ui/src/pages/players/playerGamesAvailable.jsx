import * as React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Avatar,
  Chip,
  Divider,
  Stack,
  Grid,
  Pagination,
  Fade,
  LinearProgress,
  Alert,
  Collapse,
  Hidden,
  IconButton,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./chip.css";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerGid } from "./playerSlice";
import {
  createSearchResults,
  fetchPlaysByGid,
} from "../../services/PlayerService";

export default function GamesAvailable(props) {
  const {
    gamesAvailableSortedByPoints,
    filteredSearchLoading,
    gameShowing,
    gid,
  } = useSelector((state) => state.player);

  const playerState = useSelector((state) => state.player);
  const dispatch = useDispatch();

  const [slicedGamesShowing, setSlicedGamesShowing] = React.useState([]);
  const [usePagination, setUsePagination] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [collapsed, setCollapsed] = React.useState(false);
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // When we change pages we need to update the games showing
  React.useEffect(() => {
    let newStart = page === 1 ? 0 : page * 8;
    let newEnd = page === 1 ? 8 : page * 8 + 8;

    if (newEnd > gamesAvailableSortedByPoints.length) {
      newEnd = gamesAvailableSortedByPoints.length;
    }
    setSlicedGamesShowing(gamesAvailableSortedByPoints.slice(newStart, newEnd));
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
      return "#35afea";
    } else if (points >= 20) {
      return "#57bb6a";
    } else if (points >= 10) {
      return "#f57c00";
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
    if (gamesAvailableSortedByPoints.length > 8) {
      setUsePagination(true);
      setPageCount(Math.floor(gamesAvailableSortedByPoints.length / 8));
      setSlicedGamesShowing(gamesAvailableSortedByPoints.slice(0, 8));
    } else {
      setUsePagination(false);
      setSlicedGamesShowing(gamesAvailableSortedByPoints);
    }
  }, [gamesAvailableSortedByPoints]);

  React.useEffect(() => {
    if (gid !== null) {
      console.log("fired");
      let options = createSearchResults(playerState);
      dispatch(fetchPlaysByGid(options));
    }
  }, [gid]);

  return (
    <>
      <Paper
        variant='outlined'
        sx={{
          bgcolor: "#333",
          mt: 1,
        }}>
        {filteredSearchLoading && <LinearProgress variant='indeterminate' />}

        <Grid container alignItems={"center"}>
          {/* Mobile view of Games Found Header */}
          <Hidden smUp>
            <Grid item xs={10} textAlign={"center"}>
              <Chip
                sx={{ my: 1 }}
                variant='filled'
                label={
                  <Typography variant='body1'>
                    Games Found From Search
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={2}>
              {!collapsed && (
                <IconButton onClick={() => setCollapsed(true)}>
                  <ExpandLessIcon />
                </IconButton>
              )}

              {collapsed && (
                <IconButton onClick={() => setCollapsed(false)}>
                  <ExpandMoreIcon />
                </IconButton>
              )}
            </Grid>
          </Hidden>
          {/* Desktop view of games found header */}
          <Hidden smDown>
            <Grid item xs={12} textAlign={"center"}>
              <Chip
                sx={{ my: 1 }}
                variant='filled'
                label={
                  <Typography variant='body1'>
                    Games Found From Search
                  </Typography>
                }
              />
            </Grid>
          </Hidden>
        </Grid>

        <Collapse in={!collapsed}>
          <Paper sx={{ maxHeight: "60vh", overflow: "auto" }}>
            <Alert severity='info'>
              <strong>Click</strong> any game to view it's specific highlights,
              PTS total may be innacurate
            </Alert>
            <List>
              {slicedGamesShowing &&
                slicedGamesShowing.map((game) => (
                  <React.Fragment key={game[0]}>
                    {/* Top of blue outline for selected game */}
                    {game[0] === gameShowing.gid && (
                      <Paper
                        variant='outlined'
                        sx={{
                          bgcolor: "#90caf9",
                          minWidth: "2px",
                        }}></Paper>
                    )}

                    {/* Main Component */}
                    <Fade in={true}>
                      <ListItem divider={<Divider />}>
                        <ListItemButton
                          onClick={() => {
                            // set the game id to what was selected
                            // useEffect will trigger to fetch plays
                            dispatch(setPlayerGid(game[0]));
                          }}>
                          <Grid container>
                            <Grid item xs={6} justifyContent={"center"}>
                              <Stack
                                direction={"row"}
                                spacing={1}
                                alignItems={"center"}>
                                <Avatar
                                  src={
                                    "https://cdn.nba.com/logos/nba/" +
                                    game[1].atid +
                                    "/primary/L/logo.svg"
                                  }
                                />
                                <Hidden smDown>
                                  <Typography variant='subtitle2'>
                                    {game[1].matchupstr}
                                  </Typography>
                                </Hidden>

                                <Hidden smUp>
                                  <Typography variant='subtitle2'>@</Typography>
                                </Hidden>
                                <Avatar
                                  src={
                                    "https://cdn.nba.com/logos/nba/" +
                                    game[1].htid +
                                    "/primary/L/logo.svg"
                                  }
                                />
                                <Hidden smDown>
                                  <Chip
                                    size='small'
                                    color='default'
                                    variant='outlined'
                                    label={game[1].sznstr}
                                  />
                                </Hidden>
                              </Stack>
                            </Grid>

                            <Grid item xs={6}>
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
                                <Hidden smDown>
                                  <Chip
                                    className={
                                      game[1].playerpts >= 40 ? "icon" : ""
                                    }
                                    sx={{
                                      bgcolor: getPointsString(
                                        game[1].playerpts
                                      ),
                                      color: "black",
                                    }}
                                    label={game[1].playerpts + " PTS"}
                                  />
                                </Hidden>

                                <Hidden smUp>
                                  <Chip
                                    sx={{
                                      bgcolor: getPointsString(
                                        game[1].playerpts
                                      ),
                                      color: "black",
                                    }}
                                    label={game[1].playerpts + " PTS"}
                                  />
                                </Hidden>

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
                    </Fade>
                    {game[0] === gameShowing.gid && (
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

            {/* </Grid> */}
          </Paper>

          <Grid item xs={12}>
            {usePagination && (
              <Pagination
                sx={{ my: 1, mx: "20%" }}
                // sx={{ justifyContent: "center" }}
                page={page}
                count={pageCount}
                onChange={handlePageChange}
              />
            )}
          </Grid>
        </Collapse>
      </Paper>
    </>
  );
}
