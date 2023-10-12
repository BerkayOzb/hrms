import React from "react";
import { Box, Typography } from "@mui/material";
import OfficialDetail from "./OfficialDetails/OfficialDetail";
import PersonalDetails from "./PersonalDetails";
import styled from "@emotion/styled";
import { useAuth } from "../../context/auth";
import styles from "./styles.module.css"
export const DetailsHeading = styled(Typography)({
  fontWeight: 600,
  fontSize: "17px",
  lineHeight: "36px",
  marginBottom: "5px",
  marginTop: "15px",
});
const Profile = () => {
  const { user } = useAuth();

  return (
    <Box textAlign="center" width={"100%"}>  
      <DetailsHeading>Employee Details</DetailsHeading>
      <Box
        bgcolor="background.paper"
        borderRadius={4}
        className={styles.cardContainer}
      >
        {user && <OfficialDetail userId={user.userId} />}
      </Box>
      <DetailsHeading>Personal Details</DetailsHeading>
      {user && <PersonalDetails userId={user.userId} />}
    </Box>
  );
};

export default Profile;
