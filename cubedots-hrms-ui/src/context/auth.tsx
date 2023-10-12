import axios from "axios";
import { async } from "q";
import React, { createContext, useContext, useState } from "react";
import { APIService } from "../services/API";

type User = {
  name: {
    first_name: string;
    last_name: string;
  };
  userEmail: string;
  userId: string;
  role: string;
  empCode?: string;
};

type AuthContextProps = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const login = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    const res = await APIService.logout();
    if (res.statusCode == "7000") {
      setUser(null);
      localStorage.removeItem("token");
    }else{
      setUser(null);
      localStorage.removeItem("token");
      console.log(res.message)
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
