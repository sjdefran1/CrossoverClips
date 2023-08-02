import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Stack, Chip, Avatar, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { reqString } from "../../App";
import PlayerLabel from "./PlayerLabel";
import { createFilterOptions } from "@mui/material/Autocomplete";
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function PlayerSearchBar(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const OPTIONS_LIMIT = 10;
  const filterOptions = createFilterOptions({
    limit: OPTIONS_LIMIT,
  });

  const MyChip = (props) => {
    return (
      <Chip
        label={props.label}
        onDelete={() => null}
        variant='outlined'
        sx={{ mr: 0.5, my: 0.1 }}
        avatar={
          <Avatar
            src={
              "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
              props.id +
              ".png"
            }
          />
        }
      />
    );
  };

  const getPlayers = () => {
    axios.get(reqString + "players/allPlayers").then((response) => {
      setOptions(response.data);
    });
  };

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      getPlayers();
    }
  }, [open]);

  return (
    <Autocomplete
      id='asynchronous-demo'
      sx={{ width: "85%", mt: 0.5 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        if (newValue === undefined) {
          return;
        } else {
          props.clearFiltersAndGetSamplePlays(newValue);
        }
        // props.setCurrentPlayer(newValue);
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.fname + " " + option.lname}
      options={options}
      loading={loading}
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
  );
}
