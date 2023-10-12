import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { adminMenuItem, itAdminNavItems, navItems } from "./Navigation";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/auth";

type NavigationDrawerProps = {
  handleMenuItemClick: (tab: string) => void;
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  drawerOpen: boolean;
  activeTab: string;
};

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  handleMenuItemClick,
  toggleDrawer,
  drawerOpen,
  // activeTab,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const activeTab = location.pathname.split("/")[1];
  const activeSubTab = location.pathname.split("/")[2];
  return (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List>
        {navItems.map((item, index) => {
          const colorValue = item === activeTab ? "#E45725" : "black";

          return (
            <ListItem
              button
              key={index}
              onClick={() => {
                handleMenuItemClick(item);
              }}
              sx={{ color: colorValue, textTransform: "capitalize" }}
            >
              <ListItemText primary={item} />
            </ListItem>
          );
        })}
      </List>
      {user?.role == "admin" && (
        <List>
          {adminMenuItem.map((item, index) => {
            const colorValue = item === activeSubTab ? "#E45725" : "black";

            return (
              <ListItem
                button
                key={index}
                onClick={() => {
                  handleMenuItemClick(`admin-panel/${item}`);
                }}
                sx={{ color: colorValue, textTransform: "capitalize" }}
              >
                <ListItemText primary={item} />
              </ListItem>
            );
          })}
        </List>
      )}
      {user?.role == "admin" ||
        (user?.role == "it-admin" && (
          <List>
            {itAdminNavItems.map((item, index) => {
              const colorValue = item === activeSubTab ? "#E45725" : "black";

              return (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    handleMenuItemClick(`${item}`);
                  }}
                  sx={{ color: colorValue, textTransform: "capitalize" }}
                >
                  <ListItemText primary={item} />
                </ListItem>
              );
            })}
          </List>
        ))}
    </Drawer>
  );
};

export default NavigationDrawer;
