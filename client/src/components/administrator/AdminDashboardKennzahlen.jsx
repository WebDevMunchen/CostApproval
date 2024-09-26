import { useContext, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import { AuthContext } from "../../context/AuthProvider";
import { NavLink } from "react-router-dom";
import Chart from "react-apexcharts";

export default function AdminDashboardKennzahlen() {
  const {
    selectedYear,
    setSelectedYear,
    setStatus,
    setTitleSearch,
    setTitleSearchAdmin,
    setTitleSearchLiquidity,
    selectedDepartment,
    setSelectedDepartment,
    selectedMonth,
    setSelectedMonth,
    allKennzahlenBudgets,
    allKennzahlenInquiries,
    yearlyKennzahlenApprovals,
  } = useContext(AuthContext);

  useEffect(() => {
    setStatus("");
    setSelectedYear(new Date().getFullYear());
    setTitleSearch("");
    setTitleSearchAdmin("");
    setTitleSearchLiquidity("");
  }, []);

  let inquiryCountKennzahlen = 0;

  allKennzahlenInquiries?.forEach((element) => {
    if (element.status !== "Innerhalb des Budgets") {
      inquiryCountKennzahlen++;
    } else {
      return;
    }
  });

  const totalApprovedAmount = allKennzahlenInquiries?.reduce(
    (acc, { expenseAmount = 0, expenseAmountCent = 0, status }) => {
      // if (status === "Genehmigt") {
      acc.totalAmount += expenseAmount;
      acc.totalAmountCents += expenseAmountCent;
      // }
      return acc;
    },
    { totalAmount: 0, totalAmountCents: 0 }
  );

  const { totalAmount, totalAmountCents } = totalApprovedAmount || {
    totalAmount: 0,
    totalAmountCents: 0,
  };

  const adjustedTotalAmount = totalAmount + Math.floor(totalAmountCents / 100);
  const adjustedTotalAmountCents = totalAmountCents % 100;

  const selectedBudget = allKennzahlenBudgets?.find(
    (budget) =>
      budget.year === selectedYear &&
      budget.month === selectedMonth &&
      budget.department === selectedDepartment
  );
  const budgetAmount = selectedBudget?.amount || 0;

  const differenceInEuros =
    budgetAmount - (adjustedTotalAmount + adjustedTotalAmountCents / 100);

  const totalApprovedForYear = allKennzahlenInquiries?.reduce(
    (acc, { expenseAmount = 0, expenseAmountCent = 0, status }) => {
      // if (status === "Genehmigt") {
      acc.totalAmount += expenseAmount;
      acc.totalAmountCents += expenseAmountCent;
      // }
      return acc;
    },
    { totalAmount: 0, totalAmountCents: 0 }
  );

  const { totalAmount: totalYearlyAmount, totalAmountCents: totalYearlyCents } =
    totalApprovedForYear || { totalAmount: 0, totalAmountCents: 0 };

  const adjustedYearlyTotalAmount =
    totalYearlyAmount + Math.floor(totalYearlyCents / 100);
  const adjustedYearlyTotalCents = totalYearlyCents % 100;

  const totalBudgetForYear =
    allKennzahlenBudgets
      ?.filter((budget) => budget.year === selectedYear)
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const differenceInEurosForYear =
    totalBudgetForYear -
    (adjustedYearlyTotalAmount + adjustedYearlyTotalCents / 100);

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

  const departments = [
    "Anmietung",
    "Projektbezogene Fremdpersonalkosten",
    "Fremdpersonalkosten LL",
    "Projektbezogene Fremdtransportkosten",
    "Transportkosten/Umschlag",
  ];

  const years = [2024, 2025, 2026];

  const monthlyApprovedAmounts = months.map((_, index) => {
    const monthIndex = index + 1;

    const totalForMonth = yearlyKennzahlenApprovals
      ?.filter(
        (approval) =>
          approval.year === selectedYear &&
          approval.department === selectedDepartment &&
          months.indexOf(approval.month) + 1 === monthIndex
      )
      .reduce(
        (acc, { expenseAmount = 0, expenseAmountCent = 0 }) => {
          acc.totalAmount += expenseAmount;
          acc.totalAmountCents += expenseAmountCent;
          return acc;
        },
        { totalAmount: 0, totalAmountCents: 0 }
      );

    const { totalAmount, totalAmountCents } = totalForMonth || {
      totalAmount: 0,
      totalAmountCents: 0,
    };
    return totalAmount + totalAmountCents / 100;
  });

  const monthlyBudgets = months.map((month, index) => {
    const monthIndex = index + 1;

    const budgetForMonth = allKennzahlenBudgets?.find(
      (budget) =>
        budget.year === selectedYear &&
        months.indexOf(budget.month) + 1 === monthIndex
    );

    return budgetForMonth?.amount || 0;
  });

  const chartOptions = {
    chart: {
      height: 300,
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Augaben",
        data: monthlyApprovedAmounts,
      },
      {
        name: "Budget",
        data: monthlyBudgets,
      },
    ],
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontFamily: "Inter, ui-sans-serif",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) =>
          `${value.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}€`,
      },
      style: {
        colors: "#9ca3af",
        fontSize: "13px",
        fontFamily: "Inter, ui-sans-serif",
        fontWeight: 400,
      },
    },
    grid: {
      strokeDashArray: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.5,
        gradientToColors: ["#fb6542", "#6ab187"],
        stops: [
          [0, "#ffffff", 0.4],
          [50, "#fb6542", 0.5],
          [50, "#6ab187", 0.5],
        ],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#fb6542", "#6ab187"],
    },
    colors: ["#fb6542", "#6ab187"],
    tooltip: {
      y: {
        formatter: (value) =>
          `${value.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}€`,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div>
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />
        <div
          className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
          id="sidebarBackdrop"
        ></div>
        <div
          id="main-content"
          className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-52"
        >
          <main>
            <div className="py-6 px-4">
              <div className="mb-4 mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                      <h3 className="mb-2 px-2 text-base font-semibold text-gray-500">
                        Budget für {selectedMonth}:
                      </h3>

                      {budgetAmount === 0 ? (
                        <NavLink
                          to={"/admin/budgetVerwaltenKennzahlen"}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-2xl rounded-lg px-2 py-2 transition duration-300 ease-in-out hover:bg-blue-100"
                        >
                          Budget erstellen
                        </NavLink>
                      ) : (
                        <span className="px-2 text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                          {`${budgetAmount.toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}€`}
                        </span>
                      )}
                      <div className="invisible flex items-center text-green-500 text-base font-bold mt-2">
                        14.6%
                        <svg
                          className="w-5 h-5 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-left">
                      <h3 className="mb-2 text-base font-semibold text-gray-500">
                        Bisher ausgegeben:
                      </h3>
                      <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                        {`${totalAmount.toLocaleString("de-DE")},${
                          totalAmountCents === 0
                            ? "00"
                            : totalAmountCents.toString().padStart(2, "0")
                        }€`}
                      </span>
                      <div
                        className={`${
                          differenceInEuros >= 0
                            ? "flex items-center text-green-500 text-base font-bold mt-2"
                            : "flex items-center text-red-500 text-base font-bold mt-2"
                        }`}
                      >
                        {`${differenceInEuros.toLocaleString("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}€`}

                        {differenceInEuros >= 0 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                      <h3 className="mb-2 text-base font-semibold text-gray-500">
                        Einträge in {selectedMonth} {selectedYear}:
                      </h3>
                      <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                        {inquiryCountKennzahlen}
                      </span>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end text-base font-bold">
                      <div className="flex items-center">
                        <span className="text-base font-semibold text-gray-500 mr-2 ">
                          Noch öffen:
                        </span>
                        <span className="text-green-500">
                          {allKennzahlenInquiries?.filter(
                            (approval) =>
                              approval.status === "Neu" ||
                              approval.status === "In Prüfung"
                          ).length || 0}
                        </span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 ml-2 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                          />
                        </svg>
                      </div>

                      <div className="flex items-center mt-1">
                        <span className="text-base font-semibold text-gray-500 mr-2">
                          Abgeschlossen:
                        </span>
                        <span className="text-blue-500">
                          {allKennzahlenInquiries?.filter(
                            (approval) => approval.status === "Genehmigt"
                          ).length || 0}
                        </span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 ml-2 text-blue-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 11.625h4.5m-4.5 2.25h4.5m2.121 1.527c-1.171 1.464-3.07 1.464-4.242 0-1.172-1.465-1.172-3.84 0-5.304 1.171-1.464 3.07-1.464 4.242 0M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-base font-semibold text-gray-500 mr-2">
                          Abgelehnt:
                        </span>
                        <span className="text-red-500">
                          {allKennzahlenInquiries?.filter(
                            (approval) => approval.status === "Abgelehnt"
                          ).length || 0}
                        </span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 ml-2 text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-base font-semibold text-gray-500 mr-2">
                          Innerhalb Budget:
                        </span>
                        <span className="text-indigo-900">
                          {allKennzahlenInquiries?.filter(
                            (approval) => approval.status === "Innerhalb des Budgets"
                          ).length || 0}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 512 512"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 ml-2 text-indigo-900"
                        >
                          <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2c0 0 0 0 0 0s0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4l0 3.4 0 5.7 0 26.3zm32 0l0-32 0-25.9c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 44.2-86 80-192 80S0 476.2 0 432l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                      <h3 className="mb-2 text-base font-semibold text-gray-500">
                        Gesamtbudget in {selectedYear}:
                      </h3>
                      <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                        {`${totalBudgetForYear.toLocaleString("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}€`}
                      </span>
                      <div className="invisible flex items-center text-green-500 text-base font-bold mt-2">
                        <svg
                          className="w-5 h-5 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-left">
                      <h3 className="mb-2 text-base font-semibold text-gray-500">
                        Bisher ausgegeben:
                      </h3>
                      <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                        {`${(
                          totalYearlyAmount +
                          totalYearlyCents / 100
                        ).toLocaleString("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}€`}
                      </span>
                      <div
                        className={`${
                          differenceInEurosForYear >= 0
                            ? "flex items-center text-green-500 text-base font-bold mt-2"
                            : "flex items-center text-red-500 text-base font-bold mt-2"
                        }`}
                      >
                        {`${differenceInEurosForYear.toLocaleString("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}€`}

                        {differenceInEurosForYear >= 0 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8  2xl:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="border-gray-300 border-2 p-2 rounded-md "
                      >
                        {departments.map((dep) => (
                          <option key={dep} value={dep}>
                            {dep}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center">
                      <select
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                        className="border-gray-300 border-2 p-2 rounded-tl-md rounded-bl-md"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border-gray-300 border-2 p-2 rounded-tr-md rounded-br-md"
                      >
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="area"
                    height={450}
                  />
                </div>
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Monatsübersicht {selectedYear}:
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="overflow-x-auto rounded-lg">
                      <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Monat
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Budget
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Bisher ausgegeben
                                </th>
                                <th
                                  scope="col"
                                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Restbetrag
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {months.map((month) => {
                                const budget = allKennzahlenBudgets?.find(
                                  (b) =>
                                    b.year === selectedYear && b.month === month
                                );
                                const budgetAmount = budget ? budget.amount : 0;

                                const approved = allKennzahlenInquiries?.filter(
                                  (approval) =>
                                    approval.year === selectedYear &&
                                    approval.month === month
                                );

                                let totalApprovedAmount = 0;
                                if (approved) {
                                  approved.forEach((element) => {
                                    const {
                                      expenseAmount = 0,
                                      expenseAmountCent = 0,
                                    } = element;
                                    totalApprovedAmount +=
                                      expenseAmount + expenseAmountCent / 100;
                                  });
                                }

                                // Calculate the difference between budget and approved amounts
                                const differenceInEuros =
                                  budgetAmount - totalApprovedAmount;

                                // Format numbers with a dot as thousand separator and comma for decimal
                                const formatNumber = (number) =>
                                  new Intl.NumberFormat("de-DE", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(number);

                                return (
                                  <tr key={month}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-500">
                                      {month}
                                    </td>
                                    <td className="px-4 py-2 text-center whitespace-nowrap text-sm font-semibold text-gray-900">
                                      {formatNumber(budgetAmount) + "€"}
                                    </td>
                                    <td className="px-4 py-2 text-center whitespace-nowrap text-sm font-semibold text-gray-500">
                                      {formatNumber(totalApprovedAmount) + "€"}
                                    </td>
                                    <td
                                      className={`px-4 py-2 text-center whitespace-nowrap text-sm font-semibold ${
                                        differenceInEuros < 0
                                          ? "text-red-500"
                                          : differenceInEuros === 0
                                          ? "text-gray-900"
                                          : "text-green-500"
                                      }`}
                                    >
                                      {formatNumber(differenceInEuros) + "€"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
