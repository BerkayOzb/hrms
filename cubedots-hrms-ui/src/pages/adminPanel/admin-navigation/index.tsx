import { Button, Stack } from "@mui/material";
import React from "react";
import { useAuth } from "../../../context/auth";

type NavigationProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

const AdminNavigation: React.FC<NavigationProps> = ({
  setActiveTab,
  activeTab,
}) => {
  const { user } = useAuth();
  const adminNavItems = ["user-management","leave-management","attendance-management"];

  return (
    <Stack
      sx={{
        display: { xs: "none", sm: "block" },
      }}
      direction="row"
      spacing={4}
    >
      {user &&
        user.role === "admin" &&
        adminNavItems.map((item) => {
          const colorValue = item === activeTab ? "#E45725" : "black";
          return (
            <Button
              key={item}
              onClick={() => setActiveTab(item)}
              sx={{ color: colorValue }}
            >
              {item}
            </Button>
          );
        })}
    </Stack>
  );
};

export default AdminNavigation;
