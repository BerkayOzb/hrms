import { Stack, Typography } from "@mui/material";
import React from "react";

const AttedanceNotations: React.FC = () => {
  return (
    <Stack direction={"row"} spacing={3} p={3}>
      <Typography style={{ fontWeight: "700" , color:"green" }}>P : Present</Typography>
      <Typography style={{ fontWeight: "700", color: "orange" }}>P2 : Half Day</Typography>
      <Typography style={{ fontWeight: "700", color:"red" }}>L : Leave</Typography>
      <Typography style={{ fontWeight: "700" , color:"#1D6FC4"}}> WO : Weekly Off</Typography>
      <Typography style={{ fontWeight: "700" , color:"#FA832D"}}> H : Holiday</Typography>
    </Stack>
  );
};

export default AttedanceNotations;
