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
  const [allApprovalsAdmin, setAllApprovalsAdmin] = useState(null);
  const [allLiqudityApprovals, setAllLiqudityApprovals] = useState(null);
  const [allBudgets, setAllBudgets] = useState(null);
  const [liquidity, setLiquidity] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("de-DE", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthAdmin, setSelectedMonthAdmin] = useState("");

  const [selectedYearAdmin, setSelectedYearAdmin] = useState(new Date().getFullYear());
  const [status, setStatus] = useState("");

  useEffect(() => {
    axiosClient
      .get("/user/getProfile")
      .then((response) => {
        setUser(response.data);
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
      })
      .catch((error) => {
        setUserApprovals(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axiosClient
      .get(
        `/costApproval/getAllApprovals?month=${selectedMonth}&year=${selectedYear}&status=${status}`
      )
      .then((response) => {
        setAllApprovals(response.data);
      })
      .catch((error) => {
        setAllApprovals(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

      axiosClient
      .get(
        `/costApproval/getAllApprovals?year=${selectedYearAdmin}&status=${status}`
      )
      .then((response) => {
        setAllApprovalsAdmin(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setAllApprovalsAdmin(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axiosClient
      .get(`/costApproval/getAllApprovals?year=${selectedYear}`)
      .then((response) => {
        setYearlyApprovals(response.data);
      })
      .catch((error) => {
        setYearlyApprovals(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axiosClient
      .get(`/costApproval/getAllLiquidityApprovals?liquidity=${liquidity}`)
      .then((response) => {
        setAllLiqudityApprovals(response.data);
      })
      .catch((error) => {
        setAllLiqudityApprovals(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    axiosClient
      .get(`/budget/getAllBudgets?year=${selectedYear}`)
      .then((response) => {
        setAllBudgets(response.data);
      })
      .catch((error) => {
        setAllBudgets(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedMonth, selectedYear, selectedYearAdmin, status]);

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
        navigate("/admin/dashboard");
        // navigate("/meineAnfragen")
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
          yearlyApprovals,
          allApprovalsAdmin,
          setAllBudgets,
          allLiqudityApprovals,
          setAllLiqudityApprovals,
          selectedMonthAdmin,
          selectedYearAdmin,
          setStatus,
          setSelectedYearAdmin,
          setAllApprovalsAdmin,
          status
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
