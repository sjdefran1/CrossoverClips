import React from "react";
import {
  Grid,
  Stack,
  Box,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Hidden,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import TeamLabel from "./teamLabel";

import { selectTeam, deselectTeam } from "./teamSlice";

export default function TeamSelector() {
  const teams = useSelector((state) => state.teams);
  const dispatch = useDispatch();
  return (
    <>
      <Grid container sx={{ direction: "ltr" }}>
        <>
          {/* Desktop View East/Western Chip Header */}
          <Hidden smDown>
            <Grid item xs={12}>
              <Divider />
              <Stack direction={"row"} spacing={23} alignItems={"center"}>
                <Box my={1} ml={"20%"}>
                  <Chip variant='outlined' label='East' />
                </Box>

                <Box my={1}>
                  <Chip variant='outlined' label='West' />
                </Box>
              </Stack>
              <Divider />
            </Grid>
          </Hidden>

          <Hidden smUp>
            <Grid item xs={12} textAlign={"center"}>
              <Divider />

              <Chip
                variant='filled'
                label='East'
                sx={{ my: 0.5 }}
                size='small'
              />
              <Divider />
            </Grid>
          </Hidden>

          {/* Eastern Conference Mapping */}
          <Grid item xs={12} sm={6}>
            <Stack direction={"column"}>
              {teams.teamDetailsList
                .filter((team) => team.conf === "East")
                .map((team) => (
                  <React.Fragment key={team.id}>
                    <Stack direction={"row"}>
                      <FormControlLabel
                        key={team.id}
                        label={
                          <TeamLabel
                            team_id={team.id}
                            name={team.full_name}
                            conf={team.conf}
                          />
                        }
                        control={
                          <Checkbox
                            key={team.full_name}
                            // is this team in selected teams?
                            // highlighted icon if it is
                            checked={
                              team.id === teams.selectedTeamOne?.id ||
                              team.id === teams.selectedTeamTwo?.id
                            }
                            icon={<CircleOutlined />}
                            checkedIcon={<CircleIcon color='success' />}
                            // are two teams selected?
                            // is this one of them, need to be able to unclick if so
                            disabled={
                              teams.disableTeamSelect &&
                              !(
                                team.id === teams.selectedTeamOne?.id ||
                                team.id === teams.selectedTeamTwo?.id
                              )
                            }
                            // If this team has been selected deselect it
                            // else select
                            onChange={() =>
                              teams.selectedTeamIds.includes(team.id)
                                ? dispatch(deselectTeam(team.id))
                                : dispatch(selectTeam(team.id))
                            }
                          />
                        }
                      />
                    </Stack>
                  </React.Fragment>
                ))}
            </Stack>
          </Grid>

          {/* Mobile View West Divider */}
          <Hidden smUp>
            <Grid item xs={12} textAlign={"center"}>
              <Divider />

              <Chip
                variant='filled'
                label='West'
                sx={{ my: 0.5 }}
                size='small'
              />
              <Divider />
            </Grid>
          </Hidden>

          {/* Western Conference Team Mapping */}
          <Grid item xs={12} sm={6}>
            <Stack direction={"column"}>
              {teams.teamDetailsList
                .filter((team) => team.conf === "West")
                .map((team) => (
                  <React.Fragment key={team.id}>
                    {/* <Grid item xs={6} sm={6}> */}
                    <Stack direction={"row"}>
                      <FormControlLabel
                        key={team.id}
                        label={
                          <TeamLabel
                            team_id={team.id}
                            name={team.full_name}
                            conf={team.conf}
                          />
                        }
                        control={
                          <Checkbox
                            key={team.full_name}
                            // is this team in selected teams?
                            // highlighted icon if it is
                            checked={
                              team.id === teams.selectedTeamOne?.id ||
                              team.id === teams.selectedTeamTwo?.id
                            }
                            icon={<CircleOutlined />}
                            checkedIcon={<CircleIcon color='success' />}
                            // are two teams selected?
                            // is this one of them, need to be able to unclick if so
                            disabled={
                              teams.disableTeamSelect &&
                              !(
                                team.id === teams.selectedTeamOne?.id ||
                                team.id === teams.selectedTeamTwo?.id
                              )
                            }
                            onChange={() =>
                              teams.selectedTeamIds.includes(team.id)
                                ? dispatch(deselectTeam(team.id))
                                : dispatch(selectTeam(team.id))
                            }
                          />
                        }
                      />
                    </Stack>
                    {/* </Grid> */}
                  </React.Fragment>
                ))}
            </Stack>
          </Grid>
        </>
      </Grid>
    </>
  );
}
