import React from "react";
import { useAuth } from "../../context/auth";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { OfficialDataFromDB } from "../../utils/formateOfficialDetails";

export type User = OfficialDataFromDB

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user?.role != "admin") {
    return <Navigate to="/not-authorized" />;
  }

  return (
    <Box sx={{ width: "100%", typography: "body1", textAlign: "center" }}>
      <Outlet />
    </Box>
  );
};

export default AdminPanel;
