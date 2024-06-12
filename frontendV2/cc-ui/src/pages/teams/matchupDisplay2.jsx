import * as React from "react";
import {
  Avatar,
  Stack,
  Grid,
  Box,
  Typography,
  Chip,
  Divider,
  Fade,
  Grow,
  Paper,
} from "@mui/material";
import allnba from "../../static/allnbateamSepia.gif";

import { getTrueKeys } from "../../ccUtils/FilterUtil";
import { useSelector } from "react-redux";

export default function MatchupDisplay2(props) {
  const teamOne = useSelector((state) => state.teams.selectedTeamOne);
  const teamTwo = useSelector((state) => state.teams.selectedTeamTwo);

  // Filter Options
  const seasonsSelected = getTrueKeys(
    useSelector((state) => state.teams.searchOptions["Seasons"])
  );

  return (
    <>
      <Paper sx={{ borderRadius: 2 }}>
        <Grid container justifyContent={"center"} textAlign={"center"}>
          {!teamOne && (
            <>
              <Grid item xs={5}>
                <Stack
                  direction={"column"}
                  sx={{ alignItems: "center", textAlign: "center" }}>
                  <Avatar
                    src={allnba}
                    sx={{ width: 100, height: 100, mt: 1.2 }}
                  />
                  <Typography variant='body1'>Choose</Typography>
                  <Typography variant='body2' color={"text.secondary"}>
                    One Team
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={1}>
                <Typography
                  sx={{
                    position: "relative",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}>
                  VS
                </Typography>{" "}
              </Grid>
              <Grid item xs={5}>
                <Stack
                  direction={"column"}
                  sx={{ alignItems: "center", textAlign: "center" }}></Stack>
              </Grid>
            </>
          )}

          {/*  1 Team has been selected */}
          {teamOne && (
            <>
              <Fade in={true}>
                <Grid container justifyContent={"center"} textAlign={"center"}>
                  <Grid item xs={5}>
                    <Stack
                      direction={"column"}
                      sx={{ alignItems: "center", textAlign: "center" }}>
                      <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          teamOne.id +
                          "/primary/L/logo.svg"
                        }
                      />
                      <Typography variant='body1'>{teamOne.city}</Typography>
                      <Typography variant='body2' color={"text.secondary"}>
                        {teamOne.nickname}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={1}>
                    <Typography
                      sx={{
                        position: "relative",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}>
                      VS
                    </Typography>
                  </Grid>
                  {/* Both teams have been selected */}
                  {teamTwo ? (
                    <Fade in={true}>
                      <Grid item xs={5}>
                        <Stack
                          direction={"column"}
                          sx={{ alignItems: "center", textAlign: "center" }}>
                          <Avatar
                            sx={{ width: 100, height: 100 }}
                            src={
                              "https://cdn.nba.com/logos/nba/" +
                              teamTwo.id +
                              "/primary/L/logo.svg"
                            }
                          />
                          <Typography variant='body1'>
                            {teamTwo.city}
                          </Typography>
                          <Typography variant='body2' color={"text.secondary"}>
                            {teamTwo.nickname}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Fade>
                  ) : (
                    // <Typography textAlign={"center"}>Any Opponent</Typography>
                    <>
                      <Grid item xs={5}>
                        <Stack
                          direction={"column"}
                          sx={{ alignItems: "center", textAlign: "center" }}>
                          <Avatar
                            src={allnba}
                            sx={{ width: 100, height: 100, mt: 1.2 }}
                          />
                          <Typography variant='body1'>Any</Typography>
                          <Typography variant='body2' color={"text.secondary"}>
                            Opponent
                          </Typography>
                        </Stack>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Fade>
            </>
          )}

          {/* TODO: Remove hardcoded 10's, this is just gonna be a pain each year */}
        </Grid>
        <Divider sx={{ my: 1, mx: 4 }} />
        <Grid container alignItems={"center"} justifyContent={"center"}>
          <Grid item xs={2} textAlign={"center"}>
            <Typography variant='body2' color={"text.secondary"}>
              Seasons:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {seasonsSelected?.length === 10 && (
              <Chip label='Any since 2014-15' sx={{ my: 0.5 }} />
            )}

            {seasonsSelected?.length !== 10 && <Chip label='Custom' />}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
