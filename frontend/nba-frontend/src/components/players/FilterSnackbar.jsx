import * as React from "react";
import { Grid, Button, Paper } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function FilterSnackBar(props) {
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
      <Grid container>
        <Grid item xs={4} alignItems={"center"}>
          <Button
            onClick={() => props.setFiltersShowing(!props.filtersShowing)}
            variant='text'
            color='info'
            endIcon={
              props.filtersShowing ? (
                <ExpandLessIcon sx={{ mr: 1 }} />
              ) : (
                <ExpandMoreIcon sx={{ mr: 1 }} />
              )
            }
            sx={{}}>
            {props.filtersShowing
              ? "Collapse All Filters"
              : "Expand All Filters"}
          </Button>
        </Grid>
        <Grid item xs={4} textAlign={"center"} mr={1} alignItems={"center"}>
          <Button
            onClick={() => props.setFiltersShowing(!props.filtersShowing)}
            variant='text'
            color='success'
            endIcon={<SearchIcon sx={{ mr: 1 }} />}
            sx={{}}>
            {"Submit Filters"}
          </Button>
        </Grid>
        <Grid
          item
          xs={3}
          // justifyContent={"right"}
          textAlign={"left"}
          alignItems={"center"}>
          <Button
            onClick={() => props.setFiltersShowing(!props.filtersShowing)}
            variant='text'
            color='warning'
            endIcon={<DeleteIcon sx={{ mr: 1 }} />}
            sx={{}}>
            {"Clear Filters"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
