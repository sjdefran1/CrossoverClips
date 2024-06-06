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

export default function MatchupDisplay(props) {
  const teamOne = useSelector((state) => state.teams.selectedTeamOne);
  const teamTwo = useSelector((state) => state.teams.selectedTeamTwo);

  // Filter Options
  const seasonsSelected = getTrueKeys(
    useSelector((state) => state.teams.searchOptions["Seasons"])
  );

  return (
    <>
      <Paper sx={{ borderRadius: 2 }}>
        <Stack direction={"column"} sx={{ mx: 1, mb: 1 }}>
          {!teamOne && (
            <>
              <Box
                sx={{
                  ml: { sm: "5%", md: "15%" },
                }}>
                <Stack
                  direction={"row"}
                  spacing={{ xs: 7, md: 10 }}
                  sx={{ alignItems: "center" }}>
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
                  <Typography>VS</Typography>
                  <Stack
                    direction={"column"}
                    sx={{ alignItems: "center", textAlign: "center" }}>
                    <Typography>Any Opponent</Typography>
                  </Stack>
                </Stack>
              </Box>
            </>
          )}

          {/*  1 Team has been selected */}
          {teamOne && (
            <>
              <Fade in={true}>
                <Box
                  sx={{
                    ml: { sm: "5%", md: "15%" },
                  }}>
                  <Stack
                    direction={"row"}
                    spacing={{ xs: 5, md: 10 }}
                    sx={{ alignItems: "center" }}>
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
                    <Typography>VS</Typography>
                    {/* Both teams have been selected */}
                    {teamTwo ? (
                      <Fade in={true}>
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
                      </Fade>
                    ) : (
                      // <Typography textAlign={"center"}>Any Opponent</Typography>
                      <>
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
                      </>
                    )}
                  </Stack>
                </Box>
              </Fade>
            </>
          )}
          <Divider sx={{ my: 1, mx: 4 }} />

          {/* TODO: Remove hardcoded 10's, this is just gonna be a pain each year */}

          <Box ml={"10%"} mb={2}>
            <Stack direction={"row"} alignItems={"center"}>
              <Typography variant='body2' color={"text.secondary"}>
                Seasons:
              </Typography>
              {seasonsSelected?.length === 10 && (
                <Chip label='Any since 2014-15' sx={{ mx: 0.5, my: 0.5 }} />
              )}
              <Grid item xs={12}>
                {seasonsSelected?.length !== 10 &&
                  seasonsSelected?.map((season) => (
                    <React.Fragment key={season}>
                      <Grow in timeout={600}>
                        <Chip
                          label={season}
                          color='info'
                          sx={{ mx: 0.5, my: 0.5 }}
                        />
                      </Grow>
                    </React.Fragment>
                  ))}
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
