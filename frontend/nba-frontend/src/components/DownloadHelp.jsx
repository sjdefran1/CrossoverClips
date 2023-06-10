import {
  Typography,
  Paper,
  Container,
  Grid,
  Alert,
  Chip,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import React from "react";
import NbaHeader from "./NbaHeader";
import NbaFooter from "./NbaFooter";
import { reqString } from "../App.js";

import axios from "axios";
import fileDownload from "js-file-download";

export default function DownloadHelp(props) {
  return (
    <>
      <Paper
        sx={
          {
            // background: "#1b1b1b",
            //   "radial-gradient(circle, hsla(0, 0%, 22%, 1) 0%, hsla(0, 100%, 13%, 1) 25%, hsla(216, 53%, 12%, 1) 57%, hsla(0, 0%, 11%, 1) 84%)",
            // backgroundSize: "110% 110%",
            // animation: `${gradient} 4s infinite alternate`,
          }
        }>
        <NbaHeader />
      </Paper>

      <Container maxWidth='lg' sx={{ padding: 1 }}>
        <Paper>
          <Grid container xs={12}>
            <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
              <Typography variant='h5'>Mobile Download</Typography>
              <Divider sx={{ mx: 5, my: 1 }} />

              <Alert severity='info' sx={{ padding: 1 }}>
                On IOS, use safari if you want to download clips
              </Alert>
              <Paper sx={{ mx: "30%", my: 1 }} elevation={3}>
                <Typography variant='h6'>Option 1</Typography>
              </Paper>

              <Stack
                direction={"row"}
                spacing={1}
                sx={{ alignItems: "center", mx: 2, my: 1 }}>
                <Chip label='1' size='small' />
                <Typography variant='body2'>
                  Navigate to game and clip you want to download
                </Typography>
              </Stack>

              <Stack
                direction={"row"}
                spacing={1}
                sx={{ alignItems: "center", mx: 2, my: 1 }}>
                <Chip label='2' size='small' />
                <Typography variant='body2'>
                  Click the blue download button, be patient a pop-up will apear
                  shortly
                </Typography>
              </Stack>

              <Typography variant='h6'>Option 2</Typography>
            </Grid>

            <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
              <Typography variant='h5'>Desktop Download</Typography>
              <Divider sx={{ mx: 5, my: 1 }} />
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <NbaFooter />
    </>
  );
}
