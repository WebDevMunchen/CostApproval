import { createContext, useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userApprovals, setUserApprovals] = useState(null);
  const [yearlyApprovals, setYearlyApprovals] = useState(null);
  const [allApprovals, setAllApprovals] = useState(null);
  const [allBudgets, setAllBudgets] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('de-DE', { month: 'long' })
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    axiosClient
      .get("/user/getProfile")
      .then((response) => {
        setUser(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axiosClient
      .get("/costApproval/getUserApprovals")
      .then((response) => {
        setUserApprovals(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setUserApprovals(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

      axiosClient
      .get(`/costApproval/getAllApprovals?month=${selectedMonth}&year=${selectedYear}`)
      .then((response) => {
        setAllApprovals(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        setAllApprovals(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

      axiosClient
      .get(`/costApproval/getAllApprovals?year=${selectedYear}`)
      .then((response) => {
        setYearlyApprovals(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setYearlyApprovals(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axiosClient
      .get("/budget/getAllBudgets")
      .then((response) => {
        setAllBudgets(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        setAllBudgets(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedMonth, selectedYear]);

  const login = async (data) => {
    axiosClient
      .post("/user/login", data)
      .then((response) => {
        setUser(response.data);

        return axiosClient.get("/costApproval/getUserApprovals");
      })
      .then((response) => {
        setUserApprovals(response.data);

        return axiosClient("/costApproval/getAllApprovals");
      })
      .then((response) => {
        setAllApprovals(response.data);

        return axiosClient("/budget/getAllBudgets");
      })
      .then((response) => {
        setAllBudgets(response.data);
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
      <AuthContext.Provider
        value={{
          login,
          logout,
          user,
          isLoading,
          userApprovals,
          setUserApprovals,
          allBudgets,
          allApprovals,
          selectedMonth,
          selectedYear,
          setSelectedMonth,
          setSelectedYear,
          yearlyApprovals
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
