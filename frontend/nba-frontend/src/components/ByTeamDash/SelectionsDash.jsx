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
} from "@mui/material";
import jordanGif from "../../static/jordan.gif";

export default function SelectionsDash(props) {
  const [selectedTeams, setSelectedTeams] = React.useState([]);
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);

  React.useEffect(() => {
    setSelectedTeams(props.selectedTeamsParent);
  }, [props.selectedTeamsParent]);

  React.useEffect(() => {
    setSeasonsSelected(props.selectedSeasonsParent);
  }, [props.selectedSeasonsParent]);

  return (
    <>
      <Stack direction={"column"}>
        {!selectedTeams[0]?.id && (
          <>
            <Box ml={"15%"}>
              <Stack
                direction={"row"}
                spacing={10}
                sx={{ alignItems: "center" }}>
                <Stack
                  direction={"column"}
                  sx={{ alignItems: "center", textAlign: "center" }}>
                  <Avatar src={jordanGif} sx={{ width: 100, height: 100 }} />
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
              <Box ml={"15%"}>
                <Stack
                  direction={"row"}
                  spacing={10}
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
            {seasonsSelected?.length === 0 && (
              <Chip label='Any' sx={{ mx: 0.5, my: 0.5 }} />
            )}
            <Grid item xs={12}>
              {seasonsSelected?.map((season) => (
                <React.Fragment key={season}>
                  <Chip label={season} color='info' sx={{ mx: 0.5, my: 0.5 }} />
                </React.Fragment>
              ))}
            </Grid>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
