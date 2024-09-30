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

  const currentMonthIndex = new Date().getMonth();
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

  const options = [];

  const now = new Date();
  const day = now.getDate();

  if (currentMonthIndex > 0) {
    if (day > 5) {
      options.push(months[currentMonthIndex]);
    } else {
      options.push(months[currentMonthIndex - 1]);
    }
  }

  for (let i = currentMonthIndex; i < 12; i++) {
    options.push(months[i]);
  }

  const [selectedMonth, setSelectedMonth] = useState(options[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    user?.leadRole[0]
  );

  const [defaultValueCents, setDefaultValueCents] = useState(0);
  const [allKennzahlenBudgets, setAllKennzahlenBudgets] = useState(null);

  const modalRefUpdate = useRef(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  useEffect(() => {
    axiosClient
      .get(
        `/budgetKennzahlen/getAllKennzahlenBudgets?year=${currentYear}&department=${selectedDepartment}&month=${selectedMonth}`
      )
      .then((response) => {
        setAllKennzahlenBudgets(response.data);
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
    if (!allKennzahlenBudgets || allKennzahlenBudgets.length === 0) {
      return;
    }

    const budgetData = allKennzahlenBudgets[0];

    const formAmount =
      parseFloat(data.expenseAmount) + parseFloat(data.expenseAmountCent) / 100;

    const usedAmount = budgetData.usedAmount || 0;
    const totalBudget = budgetData.amount || 0;

    axiosClient
      .post("/kennzahlen/createNewEntry", {
        ...data,
        formAmount,
        selectedMonth,
      })
      .then((response) => {
        return axiosClient.get("/kennzahlen/getAllUserKennzahlenInquiries");
      })
      .then((response) => {
        setUserKennzahlenInquiries(response.data);

        return axiosClient.get(
          `/kennzahlen/getAllUserKennzahlenInquiries?year=${selectedYear}`
        );
      })
      .then((response) => {
        setYearlyUserKennzahlenInquiries(response.data);

        notifySuccess();
        if (formAmount + usedAmount < totalBudget) {
          navigate("/kennzahlen/meineAntraege");
        }
      })
      .catch((error) => {
        if (error.response) {
        }
      });

    if (formAmount + usedAmount > totalBudget) {
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
          <div className="shadow rounded-lg px-12 py-8 mx-auto w-full max-w-[850px] bg-white">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Neuer Kennzahleneintrag:
            </h1>
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2">
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

                <div className="w-full px-3 sm:w-1/2">
                  <div
                    className={
                      user.leadRole.length === 1 ? "hidden" : "visible mb-5"
                    }
                  >
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
                      className="visiblew-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
              <div className="flex justify-between flex-wrap">
                <div className="mb-5 w-52">
                  <label
                    htmlFor="title"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Anfangsdatum
                  </label>
                  <input
                    type="date"
                    {...register("dateRangeStart", { required: true })}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
                <div className="mb-5 w-52">
                  <label
                    htmlFor="title"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Enddatum
                  </label>
                  <input
                    type="date"
                    {...register("dateRangeEnd", { required: true })}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
                <div className="mb-5 w-52">
                  <div className="flex gap-1 hover:cursor-pointer">
                    <label
                      htmlFor="title"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Monat
                    </label>
                    <div
                      className="tooltip"
                      data-tip="Von deinem Budget wird der Betrag des gewählten Monats abgezogen.
Wenn das Startdatum von einem Monat auf den nächsten verschoben wird, setzen Sie den Monat auf das Startdatum."
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-amber-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </div>
                  </div>
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
              <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2">
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

              <div>
                <button
                  className={`bg-gradient-to-b ${
                    allKennzahlenBudgets && allKennzahlenBudgets.length === 0
                      ? "from-slate-500 to-slate-600 hover:cursor-not-allowed"
                      : "from-gray-700 to-gray-900 transition transform hover:-translate-y-0.5"
                  } text-lg font-medium p-2 mt-2 md:pd-2 text-white uppercase w-full rounded cursor-pointer hover:shadow-lg font-medium`}
                  disabled={
                    !allKennzahlenBudgets || allKennzahlenBudgets.length === 0
                  }
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
                  className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 me-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Achtung!</span> Mit diesem
                    Eintrag hast du dein Budgetlimit überschritten. Dieser
                    Eintrag muss zuerst von deinem Vorgesetzten genehmigt werden
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
