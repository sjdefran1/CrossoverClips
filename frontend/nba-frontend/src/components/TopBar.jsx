import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Hidden from "@mui/material/Hidden";

export default function TitleBar() {
  return (
    <>
      <Hidden mdDown>
        <AppBar position='fixed' sx={{ opacity: "70%" }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant='h6'>SJD</Typography>

            <Button
              variant='text'
              sx={{ ml: 2, borderBottom: 2, borderColor: "secondary" }}>
              Intro
            </Button>

            <Button
              variant='text'
              sx={{ ml: 2, borderBottom: 2, borderColor: "secondary" }}>
              Work Experience
            </Button>

            <Button
              variant='text'
              sx={{ ml: 2, borderBottom: 2, borderColor: "secondary" }}>
              Projects
            </Button>

            <Button
              variant='text'
              sx={{ ml: 2, borderBottom: 2, borderColor: "secondary" }}>
              Contact Me!
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Hidden>
    </>
  );
}
