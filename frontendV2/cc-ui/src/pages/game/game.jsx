import React from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Grid, Tabs, Tab } from "@mui/material";
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
      <Container maxWidth={"xl"}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {!game.basicGameInfoLoading && !game.playByPlayLoading && (
              <>
                <ScoreBoard />

                {/* Filter/Game Stats Tabs */}
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider", mb: 0.5 }}>
                    <Tabs
                      centered
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label='Filters or Game Stats'>
                      <Tab label='Filters' tabIndex={0} />
                      <Tab label='Game Stats' tabIndex={1} />
                    </Tabs>
                  </Box>
                </Box>

                {/* Render corresponding tab element */}
                {tabValue === 0 && (
                  <>
                    <Grid container>
                      <Grid item xs={12} md={8}>
                        <PlayerFilter />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <GameStatFilter />
                      </Grid>
                    </Grid>
                  </>
                )}
                {tabValue === 1 && <GameStatsDash />}
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {!game.basicGameInfoLoading && !game.playByPlayLoading && (
              <>
                <QuarterControl />

                <Box overflow={"auto"} maxHeight={"80vh"}>
                  <GamePlayList />
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
