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
  const [selectedYearAdmin, setSelectedYearAdmin] = useState(
    new Date().getFullYear()
  );
  const [status, setStatus] = useState("");
  const [statusAccounting, setStatusAccounting] = useState("");
  const [approver, setApprover] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [titleSearchAdmin, setTitleSearchAdmin] = useState("");
  const [titleSearchLiquidity, setTitleSearchLiquidity] = useState("");
  const [userRole, setUserRole] = useState("");

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
        .get(
          `/costApproval/getUserApprovals?status=${status}&year=${selectedYear}&title=${titleSearch}`
        )
        .then((response) => {
          setUserApprovals(response.data);
          console.log(`/costApproval/getUserApprovals?title=${titleSearch}`);
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
          `/costApproval/getAllApprovals?year=${selectedYearAdmin}&status=${status}&title=${titleSearchAdmin}${
            approver ? `&approver=${approver}` : ""
          }`
        )
        .then((response) => {
          console.log(
            `/costApproval/getAllApprovals?year=${selectedYearAdmin}&status=${status}&title=${titleSearchAdmin}${
              approver ? `&approver=${approver}` : ""
            }`
          );
          setAllApprovalsAdmin(response.data);
        })
        .catch(() => {
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
        .catch(() => {
          setYearlyApprovals(null);
        })
        .finally(() => {
          setIsLoading(false);
        });

      axiosClient
        .get(
          `/costApproval/getAllLiquidityApprovals?liquidity=${liquidity}&year=${selectedYearAdmin}&liquidityStatus=${statusAccounting}&title=${titleSearchLiquidity}`
        )
        .then((response) => {
          setAllLiqudityApprovals(response.data);
        })
        .catch(() => {
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
        .catch(() => {
          setAllBudgets(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchApprovals();
  }, [
    user,
    approver,
    selectedMonth,
    selectedYear,
    selectedYearAdmin,
    status,
    titleSearch,
    statusAccounting,
    titleSearchLiquidity,
    titleSearchAdmin,
  ]);

  const login = async (data) => {
    let role;

    axiosClient
      .post("/user/login", data)
      .then((response) => {
        setUser(response.data);
        role = response.data.role;
        return axiosClient.get("/costApproval/getUserApprovals");
      })
      .then((response) => {
        setUserApprovals(response.data);

        return axiosClient(
          `/costApproval/getAllApprovals?month=${selectedMonth}&year=${selectedYear}&status=${status}`
        );
      })
      .then((response) => {
        setAllApprovals(response.data);

        return axiosClient(`/budget/getAllBudgets?year=${selectedYear}`);
      })
      .then((response) => {
        setAllBudgets(response.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/meineAnfragen");
        }
        console.log(role);
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
        setStatusAccounting,
        titleSearchLiquidity,
        setTitleSearchLiquidity,
        setTitleSearchAdmin,
        titleSearchAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
