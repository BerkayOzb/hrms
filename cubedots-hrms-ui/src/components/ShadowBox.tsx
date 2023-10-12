import * as React from "react";
import { Box as MuiBox } from "@mui/material";

const ShadowBox = (props: any) => {
  return (
    <MuiBox
      boxShadow="4px 4px 15px 0px #00000033"
      borderRadius={5}
      padding={3}
      height={"100%"}
      {...props}
    />
  );
};

export default ShadowBox;
