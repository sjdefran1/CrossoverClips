import { Avatar } from "@mui/material";
import { useParams } from "react-router-dom";

export default function PlayerImage() {
  const { pid } = useParams();
  return (
    <>
      <Avatar
        src={
          "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
          pid +
          ".png"
        }
      />
    </>
  );
}
