import { Button, Menu, MenuItem, Stack } from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../../context/auth";
import { useLocation } from "react-router-dom";

type NavigationProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};
export const navItems = ["home", "attendence", "leave"];
export const adminNavItems = ["admin-panel"];
export const itAdminNavItems = ["insert-attendance"];
export const adminMenuItem = [
  "user-management",
  "attendance-management",
  "leave-management",
];

const Navigation: React.FC<NavigationProps> = ({ setActiveTab }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const activeTab = location.pathname.split("/")[1];
  const activeSubTab = location.pathname.split("/")[2];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (tab: string) => {
    setActiveTab(`admin-panel/${tab}`);
    handleMenuClose();
  };

  return (
    <Stack
      sx={{
        display: { xs: "none", sm: "block" },
      }}
      direction="row"
      spacing={4}
    >
      {navItems.map((item, index) => {
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
      {user &&
        user.role === "admin" &&
        adminNavItems.map((item, index) => {
          const colorValue = item === activeTab ? "#E45725" : "black";
          return (
            <React.Fragment key={index}>
              <Button
                sx={{ color: colorValue }}
                onClick={(e) => {
                  handleMenuOpen(e);
                }}
              >
                {item}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {adminMenuItem.map((item, index) => {
                  return (
                    <MenuItem
                      key={item}
                      onClick={() => handleMenuItemClick(item)}
                      sx={{
                        color: activeSubTab == item ? "#E45725" : "black",
                        textTransform:"capitalize"
                      }}
                    >
                      {item}
                    </MenuItem>
                  );
                })}
              </Menu>
            </React.Fragment>
          );
        })}
      {user &&
        (user.role === "admin" || user.role == "it-admin") &&
        itAdminNavItems.map((item, index) => {
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
      <Button onClick={logout} sx={{ color: "black" }}>
        Logout
      </Button>
    </Stack>
  );
};

export default Navigation;
