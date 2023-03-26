import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Hidden from "@mui/material/Hidden";
import { Link } from "@mui/material";

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
              <Link
                target='_blank'
                rel='noreferrer'
                href='http://sjdefran.com/#intro'>
                Intro
              </Link>
            </Button>

            <Button
              variant='text'
              sx={{ ml: 2, borderBottom: 2, borderColor: "secondary" }}>
              <Link
                target='_blank'
                rel='noreferrer'
                href='http://sjdefran.com/#work'>
                Work Experience
              </Link>
            </Button>

            <Button
              variant='text'
              sx={{ ml: 2, borderBottom: 2, borderColor: "secondary" }}>
              <Link
                target='_blank'
                rel='noreferrer'
                href='http://sjdefran.com/#projects'>
                Projects
              </Link>
            </Button>

            <Button
              variant='text'
              sx={{ ml: 2, borderBottom: 2, borderColor: "secondary" }}>
              <Link
                target='_blank'
                rel='noreferrer'
                href='http://sjdefran.com/#contact'>
                Contact Me!
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Hidden>
    </>
  );
}
