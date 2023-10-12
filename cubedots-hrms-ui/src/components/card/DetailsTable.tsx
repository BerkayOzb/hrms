import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import styles from "./styles.module.css";

type UserDetails = {
  data: { key: string; value: string }[][];
};

const DetailsTable: React.FC<UserDetails> = ({ data }) => {
  return (
    <Box
      p={2}
      borderRadius={4}
    >
      <Grid container direction={"row"} spacing={5}>
        {data.map((member, i) => {
          return (
            <Grid item md={12} key={i}>
              <Grid container justifyContent={"space-around"} spacing={2}>
                {member.map((item, ind) => {
                  return (
                    <Grid item key={ind} md={3}>
                      <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        spacing={2}
                      >
                        <Typography
                          variant="subtitle1"
                          className={styles.detail_keys}
                          textAlign="left"
                          sx={{ textTransform: "capitalize", minWidth: "50px" }}
                        >
                          {item.key}
                        </Typography>
                        <Box
                          boxShadow="0 0 5px 0 rgba(0, 0, 0, 0.25)"
                          borderRadius="20px"
                          bgcolor="#ffffff"
                          p={1}
                          sx={{
                            minWidth: "150px",
                            margin: "0px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            textAlign="left"
                            // sx={{ textTransform: "capitalize" }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DetailsTable;
