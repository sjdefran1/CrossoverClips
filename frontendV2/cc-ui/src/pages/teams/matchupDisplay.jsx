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
} from "@mui/material";
// import jordanGif from "../../static/jordan.gif";

import { useSelector } from "react-redux";

export default function MatchupDisplay(props) {
  const teamOne = useSelector((state) => state.teams.selectedTeamOne);
  const teamTwo = useSelector((state) => state.teams.selectedTeamTwo);

  return (
    <>
      <Stack direction={"column"}>
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
                    // src={jordanGif}
                    sx={{ width: 85, height: 85, mt: 1.2 }}
                  />
                  <Typography>Choose 1 team!</Typography>
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
                        <Typography variant='body1'>{teamTwo.city}</Typography>
                        <Typography variant='body2' color={"text.secondary"}>
                          {teamTwo.nickname}
                        </Typography>
                      </Stack>
                    </Fade>
                  ) : (
                    <Typography textAlign={"center"}>Any Opponent</Typography>
                  )}
                </Stack>
              </Box>
            </Fade>
          </>
        )}
        {/* <Divider sx={{ my: 1, mx: 4 }} />
        <Box ml={"25%"} mb={1}>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography variant='body2' color={"text.secondary"}>
              Seasons:
            </Typography>
            {seasonsSelected?.length === 9 && (
              <Chip label='Any' sx={{ mx: 0.5, my: 0.5 }} />
            )}
            <Grid item xs={12}>
              {seasonsSelected?.length !== 9 &&
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

          <Stack direction={"row"} alignItems={"center"}>
            {props?.returnedSeasonsList?.length > 0 &&
              props?.returnedSeasonsList?.length !==
                seasonsSelected?.length && (
                <Typography variant='body2' color={"text.secondary"}>
                  Seasons Found:
                </Typography>
              )}

            {props?.returnedSeasonsList?.length === 0 && (
              <>
                <Typography variant='body2' color={"text.secondary"}>
                  Returned Seasons:
                </Typography>
                <Chip label='None' sx={{ mx: 0.5, my: 0.5 }} />
              </>
            )}
            <Grid item xs={12}>
              {props?.returnedSeasonsList?.length > 0 &&
                props?.returnedSeasonsList?.length !==
                  seasonsSelected?.length &&
                props?.returnedSeasonsList?.map((season) => (
                  <>
                    <React.Fragment key={season}>
                      <Grow in timeout={600}>
                        <Chip
                          label={season}
                          color='info'
                          sx={{ mx: 0.5, my: 0.5 }}
                        />
                      </Grow>
                    </React.Fragment>
                  </>
                ))}
            </Grid>
          </Stack>
        </Box> */}
      </Stack>
    </>
  );
}
