import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import styles from "./styles.module.css";
import styled from "@emotion/styled";

type UserDetails = {
  data: {
    key: string;
    value: string;
  }[];
};

export const CustomBox = styled(Grid)`
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25);
  margin-left: 30px;
  border-radius: 4px
  margin-right: 30px;
`;

const UserDetailsCard: React.FC<UserDetails> = ({ data }) => {
  return (
 
      <Grid container spacing={2}>
        {data.map((details) => {
          return (
            <Grid item xs={12} sm={6} lg={3} key={details.key}>
              
                <Typography
                  variant="subtitle1"
                  className={styles.detail_keys}
                  textAlign="left"
                >
                  {details.key}
                </Typography>
                <Box
                  boxShadow="0 0 5px 0 rgba(0, 0, 0, 0.25)"
                  borderRadius="20px"
                  bgcolor="#ffffff"
                  p={1}
                >
                  <Typography
                    variant="body1"
                    textAlign="left"
                    // sx={{ textTransform: "capitalize" }}
                  >
                    {details.value}
                  </Typography>
                </Box>
             
            </Grid>
          );
        })}
      </Grid>

  );
};

export default UserDetailsCard;
