import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
  Hidden,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";

import {
  fetchBasicGameInfo,
  fetchPlayByPlayByGameId,
} from "../../services/GameService";
import { useSelector, useDispatch } from "react-redux";
import GamePlayList from "./gamePlayList";
import ScoreBoard from "./gameScoreboard";
import PlayerFilter from "./playerFilter";

import GameStatsDash from "./gameStatsDash";
import QuarterControl from "./quarterControl";
import GameStatFilter from "./gameStatFilters";
import Loading from "../../components/loading";
import GameVideoWrapper from "./gameVideoWrapper";

export default function Game() {
  const { gid } = useParams();
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);
  const [tabValue, setTabValue] = React.useState(0);
  /**
   * Populate redux store with game information and play by play data
   */
  React.useEffect(() => {
    let data = {
      gid: gid,
    };
    dispatch(fetchBasicGameInfo(data));
    dispatch(fetchPlayByPlayByGameId(data));
  }, []);

  const handleTabChange = (event, newVal) => {
    setTabValue(newVal);
  };

  return (
    <>
      {/* Render Loading State if either request hasn't finished yet */}
      {game.basicGameInfoLoading || (game.playByPlayLoading && <Loading />)}

      {/* Actual Page */}
      {!game.basicGameInfoLoading && !game.playByPlayLoading && (
        <Container maxWidth={"xl"}>
          <Grid container spacing={2} mt={1}>
            <Grid item sm={12} md={6} width={"100%"}>
              <>
                {/* Team Vs Team, score, date */}
                <ScoreBoard />

                {/* Filter/Game Stats Tabs */}

                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    mb: 0.5,
                    width: "100%",
                  }}>
                  <Tabs
                    centered
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label='Filters or Game Stats'>
                    <Tab label='Filters' tabIndex={0} />
                    <Tab label='Game Stats' tabIndex={1} />
                  </Tabs>
                </Box>

                {/* Render corresponding tab element */}
                {tabValue === 0 && (
                  <>
                    <Alert sx={{ justifyContent: "center" }}>
                      Filters now apply automatically on select
                    </Alert>
                    {/* Desktop View */}
                    <Hidden smDown>
                      <Grid container>
                        <Grid item sm={12} lg={8}>
                          <PlayerFilter />
                        </Grid>
                        <Grid item sm={12} lg={4}>
                          <GameStatFilter />
                        </Grid>
                      </Grid>
                    </Hidden>

                    {/* Mobile View */}
                    <Hidden smUp>
                      <Accordion sx={{ minWidth: "100%" }} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          Player Filters
                        </AccordionSummary>
                        <AccordionDetails sx={{ minWidth: "100%" }}>
                          <PlayerFilter />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion sx={{ minWidth: "100%" }} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          Stat Filters
                        </AccordionSummary>
                        <AccordionDetails>
                          <GameStatFilter />
                        </AccordionDetails>
                      </Accordion>
                    </Hidden>
                  </>
                )}
              </>
              {tabValue === 1 && (
                <Grid item sm={12}>
                  <GameStatsDash />
                </Grid>
              )}
            </Grid>

            {/* RHS of screen */}
            <Grid item sm={12} md={6}>
              <>
                {/* <GameVideoWrapper /> */}
                <QuarterControl />
                <Box overflow={"auto"} maxHeight={"80vh"}>
                  <GamePlayList />
                </Box>
              </>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}
