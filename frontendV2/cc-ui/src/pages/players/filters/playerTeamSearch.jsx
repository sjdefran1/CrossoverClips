/**
 * Search Bars on player page
 *
 * Games Vs this team
 * Games while player was on this team
 */

import {
  Stack,
  Box,
  Avatar,
  Chip,
  TextField,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { teams } from "./teams";
import { useDispatch, useSelector } from "react-redux";
import { setMatchupId, setPlayerTeamId } from "../playerSlice";
import TeamLabel from "../../teams/teamLabel";

export default function PlayerTeamSearch() {
  const dispatch = useDispatch();
  const { matchupTeamId, teamId } = useSelector((state) => state.player);
  const MyChip = (props) => {
    //   const [hidden, /setHidden] = React.useState(false);
    return (
      <Chip
        label={props.label}
        variant='outlined'
        sx={{ mr: 0.5, my: 0.1 }}
        avatar={
          <Avatar
            src={
              "https://cdn.nba.com/logos/nba/" +
              props.id +
              "/primary/L/logo.svg"
            }
          />
        }
      />
    );
  };
  return (
    <>
      {/* Matchup search bar */}
      <Autocomplete
        value={matchupTeamId}
        multiple
        autoHighlight
        clearOnEscape
        autoComplete={true}
        id='combo-box-demo'
        options={teams}
        getOptionLabel={(option) => option?.full_name}
        sx={{ width: "95%", padding: 1 }}
        size='small'
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option) => (
            <MyChip label={option.full_name} id={option.id} />
          ));
        }}
        onChange={(event, newValue) => {
          dispatch(setMatchupId(newValue));
        }}
        renderOption={(props, option) => (
          <Box component='li' {...props} key={option.id}>
            <TeamLabel team_id={option?.id} name={option?.full_name} />
          </Box>
        )}
        renderInput={(params) => (
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <SearchIcon />
            <TextField {...params} label='Find plays against these teams' />
          </Stack>
        )}
      />

      {/* Team on search bar */}
      <Autocomplete
        value={teamId}
        multiple
        autoHighlight
        clearOnEscape
        autoComplete={true}
        id='combo-box-demo'
        options={teams}
        getOptionLabel={(option) => option?.full_name}
        sx={{ width: "95%", padding: 1 }}
        size='small'
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option) => (
            <MyChip label={option.full_name} id={option.id} />
          ));
        }}
        onChange={(event, newValue) => {
          dispatch(setPlayerTeamId(newValue));
        }}
        renderOption={(props, option) => (
          // Items for dropdown of autocomplete (team logo and name)
          <Box component='li' {...props} key={option.id}>
            <TeamLabel team_id={option?.id} name={option?.full_name} />
          </Box>
        )}
        renderInput={(params) => (
          // what the search bar looks like
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <SearchIcon />
            <TextField
              {...params}
              label='Find plays when player was on these teams'
            />
          </Stack>
        )}
      />
    </>
  );
}
