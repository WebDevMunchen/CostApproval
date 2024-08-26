import { createContext, useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/user/getProfile")
      .then((response) => {
        setUser(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (data, redirectUrl) => {
    axiosClient
      .post("/user/login", data)
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
        navigate("/meineAnfragen");
      })
      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = async () => {
    axiosClient
      .post("/user/logout")
      .then((response) => {
        setUser(null);
        navigate("/");
      })
      .catch((error) => {});
  };

  return (
    <>
      <AuthContext.Provider value={{ login, logout, user, isLoading }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
