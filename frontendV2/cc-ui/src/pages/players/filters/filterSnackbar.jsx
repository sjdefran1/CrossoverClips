import * as React from "react";
import { Grid, Button, Paper, Hidden } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSelector, useDispatch } from "react-redux";
import {
  setFiltersShowing,
  clearPlayerFilters,
  setPlayerGid,
} from "../playerSlice";
import {
  createSearchResults,
  fetchFilteredPlays,
} from "../../../services/PlayerService";

export default function FilterSnackBar() {
  const dispatch = useDispatch();
  const filtersShowing = useSelector((state) => state.player.filtersShowing);
  const playerState = useSelector((state) => state.player);

  const submitSearch = () => {
    let searchOptions = createSearchResults(playerState);
    dispatch(fetchFilteredPlays(searchOptions));
  };
  return (
    <Paper
      // elevation={15}
      variant='outlined'
      sx={{
        // textAlign: "center",
        direction: "rtl",
        bgcolor: "#333",
        mt: 1,
      }}>
      <Grid container alignItems={"center"}>
        <Grid item xs={4} alignItems={"center"}>
          <Hidden smDown>
            <Button
              onClick={() => dispatch(setFiltersShowing())}
              variant='text'
              color='info'
              endIcon={
                filtersShowing ? (
                  <ExpandLessIcon sx={{ mr: 1 }} />
                ) : (
                  <ExpandMoreIcon sx={{ mr: 1 }} />
                )
              }
              sx={{}}>
              {filtersShowing ? "Collapse All Filters" : "Expand All Filters"}
            </Button>
          </Hidden>

          <Hidden smUp>
            <Button
              onClick={() => dispatch(setFiltersShowing())}
              variant='text'
              color='info'
              sx={{}}>
              {filtersShowing ? "Collapse All Filters" : "Expand All Filters"}
            </Button>
          </Hidden>
        </Grid>
        <Grid item xs={4} textAlign={"center"} mr={1} alignItems={"center"}>
          <Button
            onClick={() => submitSearch()}
            variant='text'
            color='success'
            endIcon={<SearchIcon sx={{ mr: 1 }} />}
            sx={{}}>
            {"Submit Search"}
          </Button>
        </Grid>
        <Grid
          item
          xs={3}
          // justifyContent={"right"}
          textAlign={"left"}
          alignItems={"center"}>
          <Hidden smDown>
            <Button
              onClick={() => dispatch(clearPlayerFilters())}
              variant='text'
              color='warning'
              endIcon={<DeleteIcon sx={{ mr: 1 }} />}
              sx={{}}>
              {"Clear Filters"}
            </Button>
          </Hidden>
          <Hidden smUp>
            <Button
              onClick={() => dispatch(clearPlayerFilters())}
              variant='text'
              color='warning'
              sx={{}}>
              {"Clear Filters"}
            </Button>
          </Hidden>
        </Grid>
      </Grid>
    </Paper>
  );
}
