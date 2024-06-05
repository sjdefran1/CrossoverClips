import React from "react";
import { Stack, Box, CircularProgress, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import { createFilterOptions } from "@mui/material/Autocomplete";
import PlayerLabel from "../../components/playerLabel";
import {
  fetchAllPlayers,
  updatePlayerView,
} from "../../services/PlayerService";
import { useDispatch, useSelector } from "react-redux";
import { setPlayer } from "./playerSlice";
import { useNavigate } from "react-router-dom";

export default function PlayerSearch() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const OPTIONS_LIMIT = 10;
  const filterOptions = createFilterOptions({
    limit: OPTIONS_LIMIT,
  });

  const { playersLoading, allPlayers } = useSelector((state) => state.player);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Autocomplete
        id='asynchronous-demo'
        sx={{ width: "100%", mt: 0.5 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            dispatch(setPlayer(newValue));
            navigate("/player/" + newValue.playerID);
            updatePlayerView({ pid: newValue.playerID });
          }
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.fname + " " + option.lname}
        options={allPlayers}
        loading={playersLoading}
        filterOptions={filterOptions}
        renderOption={(props, option) => (
          <Box component='li' {...props} key={option.id}>
            <PlayerLabel
              id={option?.playerID}
              name={option?.fname + " " + option?.lname}
            />
          </Box>
        )}
        renderInput={(params) => (
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <SearchIcon />

            <TextField
              {...params}
              label='Search for a new player'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          </Stack>
        )}
      />
    </>
  );
}
