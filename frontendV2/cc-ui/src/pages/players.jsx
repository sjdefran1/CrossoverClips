import React from "react";
import PlayerImage from "../components/playerImage";
import ChoosePlayer from "../components/choosePlayer";

import { useSelector } from "react-redux";

export default function Players() {
  return (
    <>
      <h3>Players</h3>
      <p>Hello This is palyers</p>
      <PlayerImage />
      <ChoosePlayer />
    </>
  );
}
