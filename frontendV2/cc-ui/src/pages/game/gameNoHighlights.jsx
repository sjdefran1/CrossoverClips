import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

import { useNavigate } from "react-router-dom";

export default function GameNoHighlights() {
  const navigate = useNavigate();

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 6, borderRadius: 4 }}>
        <Stack spacing={3} alignItems='center'>
          <SentimentDissatisfiedIcon color='warning' sx={{ fontSize: 45 }} />
          <Typography variant='h4' align='center' gutterBottom>
            No Highlights Available
          </Typography>
          <Divider flexItem />
          <Alert severity='info'>
            <Typography variant='body2'>
              If you're seeing this screen, there are a couple of possible
              reasons:
            </Typography>
            <Box mt={2}>
              <ul>
                <li>
                  <Typography variant='body2'>
                    <b>The game just finished:</b> Highlights may not be
                    available yet. Please check back soon!
                  </Typography>
                </li>
                <li>
                  <Typography variant='body2'>
                    <b>There is an issue with this game's data:</b> Sometimes,
                    the NBA's data does not supply highlights for certain games,
                    or there may be a temporary problem fetching them.
                  </Typography>
                </li>
              </ul>
            </Box>
          </Alert>
          <Typography variant='caption' color='text.secondary' align='center'>
            If this persists, try refreshing the page or checking another game.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
            onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
