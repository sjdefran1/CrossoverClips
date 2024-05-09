import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Box minHeight={"90vh"} textAlign={"center"}>
        <CircularProgress sx={{ mt: "10%" }} />
        <Typography sx={{ mt: 1 }}>Loading...</Typography>
      </Box>
    </>
  );
}
