import React from "react";
import PlayerSearch from "./playerSearch";
import PlayerCard from "./playerCard";
import { useSelector } from "react-redux";

export default function Player() {
  const player = useSelector((state) => state.player.currentPlayer);
  return (
    <>
      <PlayerSearch />

      {player?.playerID && <PlayerCard />}
    </>
  );
}
