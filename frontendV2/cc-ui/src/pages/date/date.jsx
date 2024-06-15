import React from "react";
import {
  Container,
  Box,
  Fade,
  LinearProgress,
  Paper,
  Grid,
  Hidden,
} from "@mui/material";

import "dayjs/locale/de";

import { useSelector } from "react-redux";
import DateSelection from "./dateSelection";
import GameList from "../../components/GameList";

import QuickLinks2 from "./dateQuickLinks2";
import CustomDateCalendar from "./dateCustomCalendar";
import NoResults from "../../components/NoResults";

export default function Date() {
  const { loading, gameList } = useSelector((state) => state.date);

  return (
    <>
      <Container maxWidth='xl' sx={{ minHeight: "70vh" }}>
        <Grid container mt={2} spacing={4}>
          <Grid item xs={12} lg={7}>
            <Fade in={true}>
              <Paper variant='outlined' sx={{ borderRadius: "0 0 6 6" }}>
                {loading && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress color='success' />
                  </Box>
                )}
                <Grid container>
                  <Hidden lgDown>
                    <Grid item lg={6}>
                      <QuickLinks2 defaultExpanded={true} />
                    </Grid>
                  </Hidden>

                  <Hidden lgUp>
                    <Grid item md={6}>
                      <QuickLinks2 defaultExpanded={false} />
                    </Grid>
                  </Hidden>
                  <Grid item xs={12} md={6}>
                    <CustomDateCalendar />
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} lg={5}>
            <DateSelection />

            {!loading && (
              <Grid container>
                <GameList gameList={gameList} />
              </Grid>
            )}

            {!loading && gameList.length < 1 && <NoResults isFromDate={true} />}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
