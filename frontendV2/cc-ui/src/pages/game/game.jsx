import React from "react";
import { useParams } from "react-router-dom";
import {
  fetchBasicGameInfo,
  fetchPlayByPlayByGameId,
} from "../../services/GameService";
import { useSelector, useDispatch } from "react-redux";

export default function Game() {
  const { gid } = useParams();
  const dispatch = useDispatch();

  /**
   * Populate redux store with game information and play by play data
   */
  React.useEffect(() => {
    let data = {
      gid: gid,
    };
    dispatch(fetchBasicGameInfo(data));
    dispatch(fetchPlayByPlayByGameId(data));
  }, []);

  return (
    <>
      <p>Hello This is a Game with the id of {gid} </p>
    </>
  );
}
