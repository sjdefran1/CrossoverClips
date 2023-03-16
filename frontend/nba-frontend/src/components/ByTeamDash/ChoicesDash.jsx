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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import TeamSearch from "./TeamSearch";
import SeasonsSelect from "./SeasonsSelect";
export default function ChoicesDash(props) {
  const [selectedTeams, setSelectedTeams] = React.useState([]);
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const getTeamsSelected = (teamsArr) => {
    setSelectedTeams(teamsArr);
    //console.log(selectedTeams);
  };

  const getSeasonsSelected = (seasonsArr) => {
    setSeasonsSelected(seasonsArr);
    //console.log(selectedTeams);
  };

  React.useEffect(() => {
    if (selectedTeams[1]?.id) {
      setExpanded(false);
    }
  }, [selectedTeams]);
  return (
    <>
      <Paper>
        <Stack direction={"column"}>
          {!selectedTeams[0]?.id && (
            <>
              <Box ml={"15%"}>
                <Stack
                  direction={"row"}
                  spacing={10}
                  sx={{ alignItems: "center" }}>
                  <Stack direction={"column"} sx={{ alignItems: "center" }}>
                    <Avatar sx={{ width: 85, height: 85 }} />
                    <Typography>Team 1</Typography>
                  </Stack>
                  <Typography>VS</Typography>
                  <Stack direction={"column"} sx={{ alignItems: "center" }}>
                    <Typography>Any Opponent</Typography>
                  </Stack>
                </Stack>
              </Box>
            </>
          )}

          {/*  1 Team has been selected */}
          {selectedTeams[0]?.id && (
            <>
              <Box ml={"15%"}>
                <Stack
                  direction={"row"}
                  spacing={10}
                  sx={{ alignItems: "center" }}>
                  <Stack direction={"column"} sx={{ alignItems: "center" }}>
                    <Avatar
                      sx={{ width: 100, height: 100 }}
                      src={
                        "https://cdn.nba.com/logos/nba/" +
                        selectedTeams[0].id +
                        "/primary/L/logo.svg"
                      }
                    />
                    <Typography variant='h6'>
                      {selectedTeams[0].city}
                    </Typography>
                    <Typography variant='body1' color={"text.secondary"}>
                      {selectedTeams[0].nickname}
                    </Typography>
                  </Stack>
                  <Typography>VS</Typography>
                  {/* Both teams have been selected */}
                  {selectedTeams[1]?.id ? (
                    <Stack direction={"column"} sx={{ alignItems: "center" }}>
                      <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          selectedTeams[1].id +
                          "/primary/L/logo.svg"
                        }
                      />
                      <Typography variant='h6'>
                        {selectedTeams[1].city}
                      </Typography>
                      <Typography variant='body1' color={"text.secondary"}>
                        {selectedTeams[1].nickname}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography>Any Opponent</Typography>
                  )}
                </Stack>
              </Box>
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <Box ml={"25%"} mb={1}>
            <Stack direction={"row"} alignItems={"center"}>
              <Typography variant='body2' color={"text.secondary"}>
                Seasons:
              </Typography>
              {seasonsSelected.length === 0 && (
                <Chip label='Any' sx={{ mx: 1 }} />
              )}
              {seasonsSelected.map((season) => (
                <Chip label={season} color='info' sx={{ mx: 1 }} />
              ))}
            </Stack>
          </Box>
        </Stack>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Choose at least 1 team</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ maxHeight: "30vh", overflow: "auto", direction: "rtl" }}>
            <Alert severity='info' sx={{ mb: 1, direction: "ltr" }}>
              Choosing a second team will fiter only games between the two
            </Alert>
            <TeamSearch setSelectedTeamsParent={getTeamsSelected} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Seasons</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SeasonsSelect updateSeasons={getSeasonsSelected} />
          </AccordionDetails>
        </Accordion>
      </Paper>
    </>
  );
}
