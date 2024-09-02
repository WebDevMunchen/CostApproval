import { useContext, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import { AuthContext } from "../../context/AuthProvider";
import { NavLink } from "react-router-dom";
import Chart from "react-apexcharts";

export default function AdminDashboard() {
  const {
    allApprovals,
    allBudgets,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    yearlyApprovals,
  } = useContext(AuthContext);

  // console.log("all approvals:", allApprovals)
  console.log("all budgets:", allBudgets);
  console.log("yearlyApprovals:", yearlyApprovals);

  // Extract the total approved amount for the selected month and year
  const totalApprovedAmount = allApprovals?.reduce(
    (acc, { expenseAmount = 0, expenseAmountCent = 0, status }) => {
      if (status === "Genehmigt") {
        acc.totalAmount += expenseAmount;
        acc.totalAmountCents += expenseAmountCent;
      }
      return acc;
    },
    { totalAmount: 0, totalAmountCents: 0 }
  );

  const { totalAmount, totalAmountCents } = totalApprovedAmount || {
    totalAmount: 0,
    totalAmountCents: 0,
  };

  // Adjust the total amount by converting cents to euros
  const adjustedTotalAmount = totalAmount + Math.floor(totalAmountCents / 100);
  const adjustedTotalAmountCents = totalAmountCents % 100;

  const selectedBudget = allBudgets?.find(
    (budget) => budget.year === selectedYear && budget.month === selectedMonth
  );
  const budgetAmount = selectedBudget?.amount || 0;

  const differenceInEuros =
    budgetAmount - (adjustedTotalAmount + adjustedTotalAmountCents / 100);

  // Calculate the total approved amount for the year
  const totalApprovedForYear = yearlyApprovals?.reduce(
    (acc, { expenseAmount = 0, expenseAmountCent = 0, status }) => {
      if (status === "Genehmigt") {
        acc.totalAmount += expenseAmount;
        acc.totalAmountCents += expenseAmountCent;
      }
      return acc;
    },
    { totalAmount: 0, totalAmountCents: 0 }
  );

  const { totalAmount: totalYearlyAmount, totalAmountCents: totalYearlyCents } =
    totalApprovedForYear || { totalAmount: 0, totalAmountCents: 0 };

  // Adjust the yearly total
  const adjustedYearlyTotalAmount =
    totalYearlyAmount + Math.floor(totalYearlyCents / 100);
  const adjustedYearlyTotalCents = totalYearlyCents % 100;

  const totalBudgetForYear =
    allBudgets
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

  const years = [2023, 2024, 2025];

  // Calculate monthly approved amounts
  const monthlyApprovedAmounts = months.map((_, index) => {
    const monthIndex = index + 1; // Assuming month is 1-indexed

    const totalForMonth = yearlyApprovals
      ?.filter(
        (approval) =>
          approval.status === "Genehmigt" &&
          approval.year === selectedYear &&
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
    return totalAmount + totalAmountCents / 100; // Convert cents to euros
  });

  // Calculate monthly budget amounts
  const monthlyBudgets = months.map((month, index) => {
    const monthIndex = index + 1; // Assuming month is 1-indexed

    const budgetForMonth = allBudgets?.find(
      (budget) =>
        budget.year === selectedYear &&
        months.indexOf(budget.month) + 1 === monthIndex
    );

    return budgetForMonth?.amount || 0;
  });

  // Set up the chart options
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
        name: "Genehmigt",
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
        opacityTo: 0.8,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
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
          className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
        >
          <main>
            <div className="py-6 px-4">
              <div className="mb-4 mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                      <h3 className="mb-2 px-2 text-base font-semibold text-gray-500">
                        Budget {selectedMonth}:
                      </h3>

                      {budgetAmount === 0 ? (
                        <NavLink
                          to={"/budgetVerwalten"}
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
                        Bisher genehmigt:
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
                        {`${differenceInEuros.toLocaleString("de-DE")}€`}

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
                        Anfragen in {selectedMonth} {selectedYear}:
                      </h3>
                      <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                        {allApprovals?.length}
                      </span>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end text-base font-bold text-green-500">
                      <div className="flex items-center">
                        <span className="text-base font-semibold text-gray-500 mr-2">
                          Noch öffen:
                        </span>
                        <span>
                          {allApprovals?.filter(
                            (approval) => approval.status !== "Genehmigt"
                          ).length || 0}
                        </span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 ml-2"
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
                        <span>
                          {allApprovals?.filter(
                            (approval) => approval.status === "Genehmigt"
                          ).length || 0}
                        </span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 ml-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 11.625h4.5m-4.5 2.25h4.5m2.121 1.527c-1.171 1.464-3.07 1.464-4.242 0-1.172-1.465-1.172-3.84 0-5.304 1.171-1.464 3.07-1.464 4.242 0M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                      <h3 className="mb-2 text-base font-semibold text-gray-500">
                        Budget {selectedYear}:
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
                        Bisher genehmigt:
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
                        {`${differenceInEurosForYear.toLocaleString("de-DE")}€`}

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
                  <div className="flex items-center justify-end mb-4">
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
                        Monatsübersicht 2024:
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
                                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Bisher genehmigt
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
                                // Find the budget and approved amount for the given month and selected year
                                const budget = allBudgets?.find(
                                  (b) =>
                                    b.year === selectedYear && b.month === month
                                );
                                const budgetAmount = budget ? budget.amount : 0;

                                const approved = yearlyApprovals?.filter(
                                  (approval) =>
                                    approval.year === selectedYear &&
                                    approval.month === month &&
                                    approval.status === "Genehmigt"
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
