import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import Sidebar from "../shared/Sidebar";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function KennzahlenForm() {
  const {
    setUserKennzahlenInquiries,
    setYearlyUserKennzahlenInquiries,
    user,
    selectedYear,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
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

  // Calculate the months to show in the select dropdown
  const options = [];

  // Add the month before the current one if not January
  if (currentMonthIndex > 0) {
    options.push(months[currentMonthIndex - 1]);
  }

  // Add current month and all months to come
  for (let i = currentMonthIndex; i < 12; i++) {
    options.push(months[i]);
  }

  const [selectedMonth, setSelectedMonth] = useState(options[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    user?.leadRole[0]
  ); // Default to first role

  console.log(selectedMonth);

  const [defaultValueCents, setDefaultValueCents] = useState(0);
  const [allKennzahlenBudgets, setAllKennzahlenBudgets] = useState(null);

  const modalRefUpdate = useRef(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  // const selectedDepartment = user?.leadRole;

  useEffect(() => {
    axiosClient
      .get(
        `/budgetKennzahlen/getAllKennzahlenBudgets?year=${currentYear}&department=${selectedDepartment}&month=${selectedMonth}`
      )
      .then((response) => {
        setAllKennzahlenBudgets(response.data);
        console.log(response.data);
        console.log(
          `/budgetKennzahlen/getAllKennzahlenBudgets?year=${currentYear}&department=${selectedDepartment}&month=${selectedMonth}`
        );
      })
      .catch(() => {
        setAllKennzahlenBudgets(null);
      });
  }, [selectedMonth, selectedDepartment]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form data before submit:", data); // Log form data

    if (!allKennzahlenBudgets || allKennzahlenBudgets.length === 0) {
      console.error("No budgets found for the selected month:", selectedMonth);
      return; // Early return if no budgets are available
    }

    const budgetData = allKennzahlenBudgets[0];

    console.log("Budget data:", budgetData); // Log the budget data

    const formAmount =
      parseFloat(data.expenseAmount) + parseFloat(data.expenseAmountCent) / 100;

    const usedAmount = budgetData.usedAmount || 0;
    const totalBudget = budgetData.amount || 0;

    console.log("Form amount:", formAmount); // Log the calculated formAmount
    console.log("Used amount:", usedAmount); // Log the usedAmount
    console.log("Total budget:", totalBudget); // Log the total budget

    axiosClient
      .post("/kennzahlen/createNewEntry", {
        ...data,
        formAmount,
        selectedMonth,
      })
      .then((response) => {
        console.log("Entry created successfully:", response.data); // Log success response
        return axiosClient.get("/kennzahlen/getAllUserKennzahlenInquiries");
      })
      .then((response) => {
        console.log("User inquiries fetched:", response.data); // Log fetched inquiries
        setUserKennzahlenInquiries(response.data);

        return axiosClient.get(
          `/kennzahlen/getAllUserKennzahlenInquiries?year=${selectedYear}`
        );
      })
      .then((response) => {
        console.log("Yearly user inquiries fetched:", response.data); // Log yearly inquiries
        setYearlyUserKennzahlenInquiries(response.data);

        notifySuccess();
        if (formAmount + usedAmount < totalBudget) {
          navigate("/kennzahlen/meineAntraege");
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error); // Log the entire error object
        if (error.response) {
          console.error(error.response.data.message); // Log specific error message if available
        }
      });

    if (formAmount + usedAmount > totalBudget) {
      console.log("Form amount exceeds the budget, showing modal");
      modalRefUpdate.current.showModal();
    }
  };

  const notifySuccess = () =>
    toast.success("Ubermittelt!", {
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
        <div className="pt-12 h-[100vh] w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
          <div className="shadow rounded-lg px-12 py-8 mx-auto w-full max-w-[750px] bg-white">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Neuer Kennzahleneintrag:
            </h1>
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="-mx-3 flex  flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="title"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Art der Kosten
                    </label>
                    <input
                      {...register("title", { required: true })}
                      type="text"
                      name="title"
                      id="title"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="Gib eine Art der Kosten ein"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Monat
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  >
                    {options.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="leadRole"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Abteilung auswählen
                    </label>
                    <select
                      {...register("leadRole", { required: true })}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      id="leadRole"
                      className={user.leadRole.length === 1 ? "hidden" : "visiblew-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"}
                    >
                      {user.leadRole.map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="additionalMessage"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Für was wird das Geld ausgegeben?
                </label>
                <textarea
                  {...register("additionalMessage", { required: true })}
                  name="additionalMessage"
                  id="additionalMessage"
                  placeholder="Beschreibe deinen Bedarf..."
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5 mt-6">
                    <label
                      htmlFor="expenseAmount"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Welche Kosten entstehen?
                    </label>
                    <div className="flex gap-2">
                      <input
                        {...register("expenseAmount", { required: true })}
                        type="number"
                        name="expenseAmount"
                        id="expenseAmount"
                        className="w-2/3 rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        placeholder="€"
                      />
                      <span className="mt-6">,</span>
                      <input
                        {...register("expenseAmountCent", { required: true })}
                        type="number"
                        name="expenseAmountCent"
                        id="expenseAmountCent"
                        defaultValue={defaultValueCents}
                        className="w-1/3 rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        placeholder="Cent"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="time"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Bei einer Budgetüberschreitung werden deine Kosten
                      genehmigt von:
                    </label>
                    <input
                      disabled
                      defaultValue={
                        user.leadRole === "Anmietung"
                          ? "Sandra Bollmann"
                          : user.leadRole === "Fremdpersonalkosten LL"
                          ? "Tobias Viße"
                          : "Ben Cudok"
                      }
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <div className="flex items-center">
                  <label className="mb-5 text-base font-semibold text-[#07074D] sm:text-xl">
                    Anhänge
                  </label>
                  <span className="mb-5 ml-2 text-md font-semibold text-gray-400">
                    {`(Nicht erforderlich)`}:
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <label
                    htmlFor="file"
                    className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-6 py-3 outline-none rounded w-max cursor-pointer font-[sans-serif]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 mr-2 fill-white inline"
                      viewBox="0 0 32 32"
                    >
                      <path
                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                        data-original="#000000"
                      />
                      <path
                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                        data-original="#000000"
                      />
                    </svg>
                    Datei auswählen
                    <input type="file" id="file" className="hidden" />
                  </label>
                  <span className="block text-base font-medium text-[#07074D]">
                    Datei erfolgreich hochgeladen
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8 text-green-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                  {/* <span className="block text-base font-medium text-[#07074D]">Noch keine Datei ausgewählt</span>
                    
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-8 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg> */}
                </div>
              </div>

              <div>
                <button
                  className={`bg-gradient-to-b ${
                    allKennzahlenBudgets && allKennzahlenBudgets.length === 0
                      ? "from-slate-500 to-slate-600 cursor-not-allowed"
                      : "from-gray-700 to-gray-900 transition transform hover:-translate-y-0.5"
                  } text-lg font-medium p-2 mt-2 md:pd-2 text-white uppercase w-full rounded cursor-pointer hover:shadow-lg font-medium`}
                  disabled={
                    !allKennzahlenBudgets || allKennzahlenBudgets.length === 0
                  } // Disable button if no budgets
                >
                  {!allKennzahlenBudgets || allKennzahlenBudgets.length === 0
                    ? "Budget noch nicht vorhanden"
                    : " Übermitteln"}
                </button>
              </div>
            </form>

            <dialog
              ref={modalRefUpdate}
              className="modal modal-bottom sm:modal-middle"
            >
              <div
                className="modal-box"
                style={{ width: "100%", maxWidth: "30%" }}
              >
                <div
                  class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <svg
                    class="flex-shrink-0 inline w-4 h-4 me-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span class="sr-only">Info</span>
                  <div>
                    <span class="font-medium">Achtung!</span> Mit diesem Eintrag
                    hast du dein Budgetlimit überschritten. Dieser Eintrag muss
                    zuerst von deinem Vorgesetzten genehmigt werden
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    onClick={() => navigate("/kennzahlen/meineAntraege")}
                    className="btn"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
