import React, { useEffect, useState } from "react";
import { useAuth } from "./auth";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { APIService } from "../services/API";

type AuthRequiredProps = {
  children: React.ReactNode;
};

const AuthRequired: React.FC<AuthRequiredProps> = ({ children }) => {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const verify = async () => {
    const res = await APIService.verifyUser();
    setIsLoading(false);
    if (res.statusCode == "7000") {
      login(res.data.userData);
    } else {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    verify();
  },[]);

  if (!isLoading && user == null) {
    return (
      <Navigate to="/login" state={{ path: location.pathname }}></Navigate>
    );
  }

  if (isLoading) {
    return (
      <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
        <CircularProgress
          style={{ position: "absolute", top: "40%", color: "#E45725" }}
        />
      </div>
    );
  }

  return <>{!isLoading && children}</>;
};

export default AuthRequired;
