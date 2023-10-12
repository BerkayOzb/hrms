import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Modal,
  Button,
  Avatar,
} from "@mui/material";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NavigationDrawer from "./NavigationDrawer";
import { modalStyle } from "../../../pages/profile/PersonalDetails";
import ChangePasswordForm from "./ChangePassword";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuth } from "../../../context/auth";

export const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useAuth();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "home";
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    navigate(`${activeTab}`);
  }, [activeTab]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (tab: string) => {
    setActiveTab(tab);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "secondary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ "@media (min-width: 600px)": { display: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton onClick={() => setActiveTab("home")}>
          <svg
            filter="drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.3))"
            width="160"
            height="60"
            id="svg-with-shadow"
          >
             <title>Cubedots</title>
            <image
              href="assets/images/cubedots-logo.svg"
              x="0"
              y="0"
              width="160"
              height="60"
            />
          </svg>
        </IconButton>

        <Toolbar>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </Toolbar>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="primary"
        >
          {/* <AccountCircle /> */}
          <Avatar
            src={`${process.env.REACT_APP_API_URL}/uploads/profiles/${
              user.user?.userId
            }?${new Date().getTime()}`}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("profile")}>
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleOpenModal();
              handleMenuClose();
            }}
          >
            Change Password
          </MenuItem>
        </Menu>
      </AppBar>
      <NavigationDrawer
        drawerOpen={drawerOpen}
        handleMenuItemClick={handleMenuItemClick}
        toggleDrawer={toggleDrawer}
        activeTab={activeTab}
      />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Button
            onClick={handleCloseModal}
            style={{ position: "absolute", right: "0%" }}
          >
            <CancelIcon />
          </Button>
          <ChangePasswordForm handleCloseModal={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
};

export default Header;
