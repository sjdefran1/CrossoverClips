import * as React from "react";
import {
  Avatar,
  Stack,
  Alert,
  Grid,
  Box,
  Typography,
  Paper,
  Accordion,
  Chip,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Fade,
  Grow,
} from "@mui/material";
import jordanGif from "../../static/jordan.gif";
import { useLocation } from "react-router-dom";
export default function SelectionsDash(props) {
  const [locationState, setLocationState] = React.useState(useLocation());
  const [selectedTeams, setSelectedTeams] = React.useState(
    !locationState.state ? [] : locationState.state.selectedTeamsLink
  );
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);

  React.useEffect(() => {
    setSelectedTeams(props.selectedTeamsParent);

    // setSelectedTeams(
    //   !locationState.state
    //     ? props.selectedTeamsParent
    //     : locationState.state.selectedTeamsLink
    // );
    //console.log(props.selectedTeamsParent);
  }, [props.selectedTeamsParent]);

  React.useEffect(() => {
    setSeasonsSelected(props.selectedSeasonsParent);
  }, [props.selectedSeasonsParent]);
  // console.log("selections dash");
  // console.log(selectedTeams);
  return (
    <>
      <Stack direction={"column"}>
        {!selectedTeams[0]?.id && (
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
                    src={jordanGif}
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
        {selectedTeams[0]?.id && (
          <>
            <Fade in={true}>
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
                      sx={{ width: 100, height: 100 }}
                      src={
                        "https://cdn.nba.com/logos/nba/" +
                        selectedTeams[0].id +
                        "/primary/L/logo.svg"
                      }
                    />
                    <Typography variant='body1'>
                      {selectedTeams[0].city}
                    </Typography>
                    <Typography variant='body2' color={"text.secondary"}>
                      {selectedTeams[0].nickname}
                    </Typography>
                  </Stack>
                  <Typography>VS</Typography>
                  {/* Both teams have been selected */}
                  {selectedTeams[1]?.id ? (
                    <Fade in={true}>
                      <Stack
                        direction={"column"}
                        sx={{ alignItems: "center", textAlign: "center" }}>
                        <Avatar
                          sx={{ width: 100, height: 100 }}
                          src={
                            "https://cdn.nba.com/logos/nba/" +
                            selectedTeams[1].id +
                            "/primary/L/logo.svg"
                          }
                        />
                        <Typography variant='body1'>
                          {selectedTeams[1].city}
                        </Typography>
                        <Typography variant='body2' color={"text.secondary"}>
                          {selectedTeams[1].nickname}
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
        <Divider sx={{ my: 1, mx: 4 }} />
        <Box ml={"25%"} mb={1}>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography variant='body2' color={"text.secondary"}>
              Seasons:
            </Typography>
            {seasonsSelected?.length === 8 && (
              <Chip label='Any' sx={{ mx: 0.5, my: 0.5 }} />
            )}
            <Grid item xs={12}>
              {seasonsSelected.length !== 8 &&
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
    </>
  );
}
