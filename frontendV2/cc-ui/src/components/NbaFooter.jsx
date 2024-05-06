import * as React from "react";
import Paper from "@mui/material/Paper";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CloudIcon from "@mui/icons-material/Cloud";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";

import {
  Container,
  Alert,
  Stack,
  Box,
  Typography,
  IconButton,
  Link,
  Snackbar,
  Hidden,
} from "@mui/material";

function Footer(props) {
  const copyText = () => {
    let email = "sjdefran@gmail.com";
    navigator.clipboard.writeText(email);
    setOpen(true);
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Container maxWidth='xl' sx={{}}>
      <Paper sx={{ mt: 2, textAlign: "center" }}>
        <Alert severity='info' sx={{ mt: 1, justifyContent: "center" }}>
          DISCLAIMER - All clips property of the NBA. No copyright infringement
          is intended
        </Alert>
        <Hidden smDown>
          <Box>
            <Stack
              spacing={2}
              direction={"row"}
              padding={1}
              sx={{ justifyContent: "center", alignItems: "center" }}>
              <Link
                href='https://sjdefran.com'
                target='_blank'
                rel='noreferrer'
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                <IconButton>
                  <CloudIcon color='primary' />
                </IconButton>

                <Typography variant='body2' color={"text.secondary"}>
                  sjdefran.com
                </Typography>
              </Link>

              <Link
                href='https://www.linkedin.com/in/sam-defrancisco-4373361b3/'
                target='_blank'
                rel='noreferrer'
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                <IconButton>
                  <LinkedInIcon color='info' />
                </IconButton>

                <Typography variant='body2' color={"text.secondary"}>
                  Sam DeFrancisco
                </Typography>
              </Link>

              <Link
                href='https://www.buymeacoffee.com/sjdefran'
                target='_blank'
                rel='noreferrer'
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                <IconButton>
                  <FreeBreakfastIcon color='warning' fontSize='large' />
                </IconButton>

                <Typography variant='body2' color={"text.secondary"}>
                  {"Support"}
                </Typography>
                <Typography variant='body2' color={"text.secondary"}>
                  {"Me"}
                </Typography>
              </Link>

              <Link
                onClick={() => copyText()}
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}>
                <IconButton>
                  <EmailIcon color='success' />
                </IconButton>
                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}>
                  <Alert
                    //   onClose={handleClose}
                    severity='success'
                    variant='filled'
                    sx={{ width: "100%" }}>
                    Email copied to clipboard
                  </Alert>
                </Snackbar>
                <Typography variant='body2' color={"text.secondary"}>
                  Copy Email
                </Typography>
              </Link>

              <Link
                href='https://instagram.com/sdefrancisco1?igshid=YmMyMTA2M2Y='
                target='_blank'
                rel='noreferrer'
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                <IconButton>
                  <InstagramIcon />
                </IconButton>

                <Typography variant='body2' color={"text.secondary"}>
                  sdefrancisco1
                </Typography>
              </Link>
            </Stack>
          </Box>
        </Hidden>

        <Hidden smUp>
          <Box>
            <Link
              href='https://www.buymeacoffee.com/sjdefran'
              target='_blank'
              rel='noreferrer'
              sx={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}>
              <IconButton>
                <FreeBreakfastIcon color='warning' fontSize='large' />
              </IconButton>

              <Typography variant='body2' color={"text.secondary"}>
                {"Support"}
              </Typography>
              <Typography variant='body2' color={"text.secondary"}>
                {"Me"}
              </Typography>
            </Link>
            <Stack
              spacing={2}
              direction={"row"}
              padding={1}
              sx={{ justifyContent: "center", alignItems: "center" }}>
              <Link
                href='https://sjdefran.com'
                target='_blank'
                rel='noreferrer'
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                <IconButton>
                  <CloudIcon color='primary' />
                </IconButton>

                <Typography variant='body2' color={"text.secondary"}>
                  sjdefran.com
                </Typography>
              </Link>
              <Link
                href='https://www.linkedin.com/in/sam-defrancisco-4373361b3/'
                target='_blank'
                rel='noreferrer'
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                <IconButton>
                  <LinkedInIcon color='info' />
                </IconButton>

                <Typography variant='body2' color={"text.secondary"}>
                  Sam DeFrancisco
                </Typography>
              </Link>
            </Stack>

            <Stack
              spacing={2}
              direction={"row"}
              padding={1}
              sx={{ justifyContent: "center", alignItems: "center" }}>
              <Link
                onClick={() => copyText()}
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}>
                <IconButton>
                  <EmailIcon color='success' />
                </IconButton>
                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}>
                  <Alert
                    //   onClose={handleClose}
                    severity='success'
                    variant='filled'
                    sx={{ width: "100%" }}>
                    Email copied to clipboard
                  </Alert>
                </Snackbar>
                <Typography variant='body2' color={"text.secondary"}>
                  Copy Email
                </Typography>
              </Link>

              <Link
                href='https://instagram.com/sdefrancisco1?igshid=YmMyMTA2M2Y='
                target='_blank'
                rel='noreferrer'
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                <IconButton>
                  <InstagramIcon />
                </IconButton>

                <Typography variant='body2' color={"text.secondary"}>
                  sdefrancisco1
                </Typography>
              </Link>
            </Stack>
          </Box>
        </Hidden>
      </Paper>
      <br></br>
    </Container>
  );
}

export default React.memo(Footer);
