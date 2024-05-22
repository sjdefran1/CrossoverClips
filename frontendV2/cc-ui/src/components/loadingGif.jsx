import React, { useEffect, useState } from "react";
import { Image } from "mui-image";
import embiidCrowd from "../static/loadingGifs/embiidCrowd.gif";
import jimmyFinger from "../static/loadingGifs/jimmyFinger.gif";
import jordanDunk from "../static/loadingGifs/jordanDunk.gif";
import kobeFade from "../static/loadingGifs/kobeFade.gif";
import lebronDunk from "../static/loadingGifs/lebronDunk.gif";
import tatumHype from "../static/loadingGifs/tatumHype.gif";
import itsover from "../static/loadingGifs/itsover.gif";
import lukaHappy from "../static/loadingGifs/lukaHappy.gif";
import stephShimmy from "../static/loadingGifs/stephShimmy.gif";
import hardenSnow from "../static/loadingGifs/hardenSnow.gif";
import sgaMeg from "../static/loadingGifs/sgaMeg.gif";
import dameWave from "../static/loadingGifs/dameWave.gif";
import westbrookDunk from "../static/loadingGifs/westbrookDunk.gif";
import jokic from "../static/loadingGifs/jokic.gif";
import { Box, LinearProgress, Typography } from "@mui/material";

// List of GIF file names
export default function LoadingGif() {
  const [selectedGif, setSelectedGif] = useState("");
  const [filePath, setFilePath] = useState("../static/loadingGifs/");
  const gifList = [
    embiidCrowd,
    jimmyFinger,
    jordanDunk,
    kobeFade,
    lebronDunk,
    hardenSnow,
    tatumHype,
    itsover,
    lukaHappy,
    stephShimmy,
    sgaMeg,
    dameWave,
    westbrookDunk,
    jokic,
  ];
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * gifList.length);
    let randomGif = gifList[randomIndex];
    setSelectedGif(randomGif);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Box width={"100%"}>
        <LinearProgress color='success' />
      </Box>
      {selectedGif && (
        <Box maxWidth={"100%"} maxHeight={"100%"}>
          <Image src={selectedGif} fit='contain' />
        </Box>
      )}
      <Typography variant='h6' sx={{ mt: 1 }}>
        Hang Tight
      </Typography>
    </div>
  );
}
