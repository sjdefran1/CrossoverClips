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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Hidden,
} from "@mui/material";
import React from "react";
import NbaHeader from "./NbaHeader";
import NbaFooter from "./NbaFooter";
import { reqString } from "../App.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import mobileBlue from "../static/mobile-blue-download.MP4";
import mbb from "../static/mbbGif.gif";
import mbb2 from "../static/mbbGif2.gif";

import d1 from "../static/d1.gif";
import d2 from "../static/d2.gif";

export default function DownloadHelp(props) {
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    // if (panel == "panel1") {
    //   setExpanded("panel2");
    // }
  };
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
        <NbaHeader small={true} />
      </Paper>

      <Container maxWidth='xl' sx={{ padding: 1 }}>
        <Paper>
          <Grid container xs={12}>
            <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant='h5'>Mobile Download</Typography>
              <Divider sx={{ mx: 5, my: 1 }} />

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
              {/* <video
                controls
                autoplay
                style={{ width: "360px", height: "720px" }}>
                <source src={mobileBlue} type='video/mp4'></source>
              </video> */}
              <Accordion
                expanded={expanded === "safari"}
                onChange={handleChange("safari")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Chip size='small' label='Safari Instructions' />
                </AccordionSummary>
                <AccordionDetails>
                  <img src={mbb} style={{ height: "80%", width: "40%" }}></img>

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{ alignItems: "center", mx: 2, my: 1 }}>
                    <Chip label='3' size='small' />
                    <Typography variant='body2'>
                      Once the pop-up appears click download
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{ alignItems: "center", mx: 2, my: 1 }}>
                    <Chip label='4' size='small' />
                    <Typography variant='body2'>
                      Navigate to title/url bar, click AA
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{ alignItems: "center", mx: 2, my: 1 }}>
                    <Chip label='5' size='small' />
                    <Typography variant='body2'>
                      Click Downloads, view your clip
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{ alignItems: "center", mx: 2, my: 1 }}>
                    <Chip label='6' size='small' />
                    <Typography variant='body2'>
                      Click the export button in bottom left to view your
                      options
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "chrome"}
                onChange={handleChange("chrome")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Chip size='small' label='Chrome Instructions' />
                </AccordionSummary>
                <AccordionDetails>
                  <img src={mbb2} style={{ height: "80%", width: "40%" }}></img>
                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{ alignItems: "center", mx: 2, my: 1 }}>
                    <Chip label='4' size='small' />
                    <Typography variant='body2'>
                      At the bottom of your screen click download on the pop-up
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{ alignItems: "center", mx: 2, my: 1 }}>
                    <Chip label='5' size='small' />
                    <Typography variant='body2'>
                      {"Click open in > Open in downloads"}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Hidden smDown>
              <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 1 }}>
                <Typography variant='h5'>Desktop Download</Typography>
                <Divider sx={{ mx: 5, my: 1 }} />

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
                    Click the blue download button, be patient a pop-up will
                    apear shortly
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ alignItems: "center", mx: 2, my: 1 }}>
                  <Chip label='3' size='small' />
                  <Typography variant='body2'>Save to your device</Typography>
                </Stack>
                {/* <Paper elevation={5} sx={{ my: 1 }}>
                  <Typography>Option 1</Typography>
                </Paper> */}
                <Stack
                  direction={"col"}
                  justifyContent={"center"}
                  sx={{ my: 1 }}>
                  <Chip label='Option 1'></Chip>
                </Stack>
                <img src={d1}></img>

                <Stack
                  direction={"col"}
                  justifyContent={"center"}
                  sx={{ my: 1 }}>
                  <Chip label='Option 2'></Chip>
                </Stack>
                <img src={d2}></img>

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
                    Click the play to be redirected to videos.nba.com/
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ alignItems: "center", mx: 2, my: 1 }}>
                  <Chip label='3' size='small' />
                  <Typography variant='body2'>
                    {"Click the three dots in lower right corner > Download"}
                  </Typography>
                </Stack>

                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ alignItems: "center", mx: 2, my: 1 }}>
                  <Chip label='4' size='small' />
                  <Typography variant='body2'>Save to your device</Typography>
                </Stack>
              </Grid>
            </Hidden>
          </Grid>
        </Paper>
      </Container>

      <NbaFooter />
    </>
  );
}
