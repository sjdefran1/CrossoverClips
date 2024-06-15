import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";
import NoResults from "../components/NoResults";
import NavBar2 from "../components/navBar2";
import Footer from "../components/NbaFooter";
import LoadingGif from "../components/loadingGif";

export default function ErrorPage() {
  const error = useRouteError();
  // console.error(error);

  return (
    <div id='error-page'>
      <NavBar2 />

      <Container maxWidth='md'>
        <Paper sx={{ textAlign: "center", m: 2 }}>
          <Typography variant='h5' padding={3}>
            Sorry an unexpected error has occured! Please try refreshing you
            page or navigating above
          </Typography>

          <Typography padding={3}>
            If this continues to happen consider shooting me an email
          </Typography>
        </Paper>
      </Container>

      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Footer />
      </Box>
    </div>
  );
}
