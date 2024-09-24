import { useContext } from "react";
import Sidebar from "../shared/Sidebar";
import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import BudgetCardIntern from "./BudgetCardIntern";

export default function BudgetIntern() {
  const { allBudgets, setAllBudgets, selectedYear, setSelectedYear } =
    useContext(AuthContext);

  const onSubmit = (data, month) => {
    const budget = allBudgets.find((b) => b.month === month);
    if (budget) {
      const updatedData = {
        amount: data.amount || "",
        year: selectedYear,
      };

      axiosClient
        .put(`/budget/editBudget/${budget._id}`, updatedData)
        .then((response) => {
          return axiosClient.get(`/budget/getAllBudgets?year=${selectedYear}`);
        })
        .then((response) => {
          setAllBudgets(response.data);
          notifySuccessUpdated();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onCreate = (data, month) => {
    const newBudgetData = {
      amount: data.amount || "",
      year: selectedYear,
    };

    axiosClient
      .post(`/budget/createBudget`, { ...newBudgetData, month })
      .then((response) => {
        return axiosClient.get(`/budget/getAllBudgets?year=${selectedYear}`);
      })
      .then((response) => {
        setAllBudgets(response.data);
        notifySuccessCreated();
      })
      .catch((error) => {
        console.log("Error creating budget:", error);
      });
  };

 
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const years = ["2024", "2025", "2026"];

  const notifySuccessCreated = () =>
    toast.success("Budget festgelegt!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      className: "mt-14 mr-6",
    });

  const notifySuccessUpdated = () =>
    toast.success("Budget aktualisiert!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      className: "mt-14 mr-6",
    });

  return (
    <div>
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />

        <div className="py-8 px-12 h-[100vh] w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
          <div className="shadow rounded-lg px-6 py-6 mx-auto w-full bg-white">
            <div className="flex justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
              <label
                htmlFor="year"
                className="block text-sm font-medium text-[#07074D]"
              >
                Wähle das Jahr:
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-fit rounded-md border border-[#e0e0e0] bg-white py-2 px-3 text-sm text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              </div>

              <div className="flex justify-around gap-8">
                  <NavLink
                    to={"/admin/budgetVerwaltenIntern"}
                    className={
                      location.pathname === "/admin/budgetVerwaltenIntern"
                        ? "text-xl px-2.5 py-1.5 rounded-lg bg-[#293751] font-semibold leading-tight tracking-tight text-white md:text-2xl dark:text-white"
                        : "middle none  font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                    }
                  >
                    Interne Anfragen
                  </NavLink>
                  <NavLink
                    to={"/admin/budgetVerwaltenKennzahlen"}
                    className="text-xl py-1.5 px-2.5 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                  >
                    Kennzahlen
                  </NavLink>
                </div>
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-4">
              Budget für das Jahr {selectedYear}:
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {months.map((month) => {
                const budget = allBudgets?.find((b) => b.month === month);

                return (
                  <BudgetCardIntern
                    key={month}
                    month={month}
                    budget={budget}
                    selectedYear={selectedYear}
                    onSubmit={onSubmit}
                    onCreate={onCreate}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
