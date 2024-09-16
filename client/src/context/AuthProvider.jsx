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
  const [statusAccounting, setStatusAccounting] = useState("");
  const [approver, setApprover] = useState(""); 
  const [titleSearch, setTitleSearch] = useState('');

  useEffect(() => {
    axiosClient
      .get("/user/getProfile")
      .then((response) => {
        const user = response.data;
        setUser(user);

        setApprover(user.firstName);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) return; 

    const fetchApprovals = () => {
      axiosClient
        .get(`/costApproval/getUserApprovals?status=${status}&year=${selectedYear}&title=${titleSearch}`)
        .then((response) => {
          setUserApprovals(response.data);
          console.log(`/costApproval/getUserApprovals?title=${titleSearch}`)
        })
        .catch(() => {
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
        .catch(() => {
          setAllApprovals(null);
        })
        .finally(() => {
          setIsLoading(false);
        });

      axiosClient
        .get(
          `/costApproval/getAllApprovals?year=${selectedYearAdmin}&status=${status}${
            approver ? `&approver=${approver}` : ""
          }`
        )
        .then((response) => {
          setAllApprovalsAdmin(response.data);
        })
        .catch(() => {
          setAllApprovalsAdmin(null);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Fetch yearly approvals
      axiosClient
        .get(`/costApproval/getAllApprovals?year=${selectedYear}`)
        .then((response) => {
          setYearlyApprovals(response.data);
        })
        .catch(() => {
          setYearlyApprovals(null);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Fetch liquidity approvals
      axiosClient
        .get(`/costApproval/getAllLiquidityApprovals?liquidity=${liquidity}&year=${selectedYearAdmin}&liquidityStatus=${statusAccounting}`)
        .then((response) => {
          setAllLiqudityApprovals(response.data);
          console.log(`/costApproval/getAllLiquidityApprovals?liquidity=${liquidity}&year=${selectedYearAdmin}&liquidityStatus=${statusAccounting}`)
          console.log(response.data)
        })
        .catch(() => {
          setAllLiqudityApprovals(null);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Fetch all budgets
      axiosClient
        .get(`/budget/getAllBudgets?year=${selectedYear}`)
        .then((response) => {
          setAllBudgets(response.data);
        })
        .catch(() => {
          setAllBudgets(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    // Trigger data fetching when approver is set
    fetchApprovals();
  }, [user, approver, selectedMonth, selectedYear, selectedYearAdmin, status, titleSearch, statusAccounting]); // Dependency array includes `approver`

  const login = async (data) => {
    axiosClient
      .post("/user/login", data)
      .then((response) => {
        setUser(response.data);

        return axiosClient.get("/costApproval/getUserApprovals");
      })
      .then((response) => {
        setUserApprovals(response.data);

        return axiosClient(`/costApproval/getAllApprovals?month=${selectedMonth}&year=${selectedYear}&status=${status}`);
      })
      .then((response) => {
        setAllApprovals(response.data);

        return axiosClient(`/budget/getAllBudgets?year=${selectedYear}`);
      })
      .then((response) => {
        setAllBudgets(response.data);
        navigate("/admin/dashboard");
        // navigate("/meineAnfragen")
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = async () => {
    axiosClient
      .post("/user/logout")
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch(() => {});
  };

  return (
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
        status,
        liquidity,
        approver,
        setApprover,
        setTitleSearch,
        titleSearch,
        statusAccounting,
        setStatusAccounting
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
