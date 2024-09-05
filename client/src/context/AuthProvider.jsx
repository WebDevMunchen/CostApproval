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
  const [approver, setApprover] = useState(""); // Approver state
  const [titleSearch, setTitleSearch] = useState('');

  // Fetch user data and set approver
  useEffect(() => {
    // Fetch user profile
    axiosClient
      .get("/user/getProfile")
      .then((response) => {
        const user = response.data;
        setUser(user);

        // Set approver to user's first name
        setApprover(user.firstName);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Fetch data dependent on approver and other filters
  useEffect(() => {
    if (!user) return; // Wait until user data is available

    const fetchApprovals = () => {
      // Fetch user approvals
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

      // Fetch all approvals based on selected month and year
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

      // Fetch all admin approvals with optional approver filter
      axiosClient
        .get(
          `/costApproval/getAllApprovals?year=${selectedYearAdmin}&status=${status}${
            approver ? `&approver=${approver}` : ""
          }`
        )
        .then((response) => {
          setAllApprovalsAdmin(response.data);
          console.log("Approvals fetched with approver filter:", response.data);
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
        .get(`/costApproval/getAllLiquidityApprovals?liquidity=${liquidity}`)
        .then((response) => {
          setAllLiqudityApprovals(response.data);
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
  }, [user, approver, selectedMonth, selectedYear, selectedYearAdmin, status, titleSearch]); // Dependency array includes `approver`

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

        return axiosClient(`/budget/getAllBudgets`);
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
        titleSearch // Add setter for approver
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
