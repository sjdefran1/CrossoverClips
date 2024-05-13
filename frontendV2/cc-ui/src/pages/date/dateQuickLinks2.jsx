import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import trophyGif from "../../static/trophy.gif";
import christmas from "../../static/christmas.png";
import playoffs from "../../static/playoffs.png";
import { useNavigate } from "react-router-dom";
import { quickLinks } from "./dateMeta";

export default function QuickLinks2() {
  const navigate = useNavigate();

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'>
          <Typography>Quick links</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ maxHeight: "50vh", overflowY: "scroll", width: "100%" }}>
          <TableContainer component={Paper}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Season Start</TableCell>
                  <TableCell align='right'>Christmas</TableCell>
                  <TableCell align='right'>Playoffs</TableCell>
                  <TableCell align='right'>Finals</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quickLinks.map((season) => {
                  const [seasonYear, dates] = Object.entries(season)[0];
                  return (
                    <>
                      <TableRow
                        key={seasonYear}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}>
                        <TableCell component='th' scope='row'>
                          <Button
                            variant='outlined'
                            onClick={() => navigate(dates.openingDay)}
                            sx={{ my: 2, color: "white", display: "block" }}>
                            {seasonYear}
                          </Button>
                        </TableCell>

                        <TableCell align='right'>
                          <IconButton onClick={() => navigate(dates.christmas)}>
                            <Avatar src={christmas} />
                          </IconButton>
                        </TableCell>
                        <TableCell align='right'>
                          <IconButton onClick={() => navigate(dates.playoffs)}>
                            <Avatar src={playoffs} />
                          </IconButton>
                        </TableCell>
                        <TableCell align='right'>
                          <IconButton onClick={() => navigate(dates.finals)}>
                            <Avatar src={trophyGif} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
