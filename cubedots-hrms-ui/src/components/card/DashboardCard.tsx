import React, { ReactNode } from "react";
import { Stack, Typography, Box, Button } from "@mui/material";
import styles from "./styles.module.css";
import EditIcon from "@mui/icons-material/Edit";

type DashboardCardProps = {
  title: string;
  children: ReactNode;
  isEditable?: boolean;
  handleClick?: () => void;
  isLoading?: boolean
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  isEditable = false,
  handleClick,
  isLoading = false
}) => {
  return (
    <Stack
      alignItems={"center"}
      justifyContent="center"
      className={styles.userInfoCard}
    >
      <Stack
        sx={{
          fontWeight: "bold",
          borderBottom: "1px solid black",
          padding: "8px",
          width: "100%",
          backgroundColor:"#58748b",
          // backgroundImage: "linear-gradient(45deg, #58748b, transparent)"
        }}
        direction={"row"}
        justifyContent={"center"}
      >
        <Typography variant="h6" sx={{ fontSize: "16px", color:"white" }}>
          {title}
        </Typography>
        {isEditable && (
          <Button onClick={handleClick} sx={{ padding: "0px" }}>
            <EditIcon />
          </Button>
        )}
      </Stack>
        
       
      <Box
        height={"90%"}
        width={"100%"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow={"hidden"}
        justifyContent={isLoading ? "center" : "start"}
      >
        {children}
      </Box>
    </Stack>
  );
};

export default DashboardCard;
