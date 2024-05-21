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

export default function Date() {
  const { loading, gameList } = useSelector((state) => state.date);

  return (
    <>
      <Container maxWidth='xl' sx={{ minHeight: "70vh" }}>
        <Grid container mt={2} spacing={4}>
          <Grid item xs={12} md={7}>
            <Fade in={true}>
              <Paper variant='outlined' sx={{ borderRadius: "0 0 6 6" }}>
                {loading && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress color='success' />
                  </Box>
                )}
                <Grid container>
                  <Hidden smDown>
                    <Grid item md={6}>
                      <QuickLinks2 defaultExpanded={true} />
                    </Grid>
                  </Hidden>

                  <Grid item xs={12} md={6}>
                    <CustomDateCalendar />
                  </Grid>

                  <Hidden smUp>
                    <Grid item sm={12}>
                      <QuickLinks2 defaultExpanded={false} />
                    </Grid>
                  </Hidden>
                </Grid>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={5}>
            <DateSelection />

            {!loading && (
              <Grid container>
                <GameList gameList={gameList} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
