import axiosClient from "../../utils/axiosClient";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function KennzahlEntryCardAdmin({ approval }) {
  const { setUserApprovals, allKennzahlenBudgets, user } =
    useContext(AuthContext);

  const [updateMessage, setUpdateMessage] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [pendingReason, setPendingReason] = useState("");

  const modalRef = useRef(null);
  const modalRefDecline = useRef(null);
  const modalRefPending = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  };

  const usersName = user.firstName + " " + user.lastName;

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return new Date(dateString).toLocaleString("de-DE", options);
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const closeModalDecline = () => {
    if (modalRefDecline.current) {
      modalRefDecline.current.close();
    }
  };

  const closeModalPending = () => {
    if (modalRefPending.current) {
      modalRefPending.current.close();
    }
  };

  const approveKennzahlenInquiry = () => {
    axiosClient
      .put(`/kennzahlen/approveKennzahlenInquiry/${approval._id}`, {
        message: "Deine Anfrage wurde genehmigt",
        status: "Genehmigt"
      })
      // .then((response) => {
      //   return axiosClient.get("/costApproval/getUserApprovals");
      // })
      .then((response) => {
        // setUserApprovals(response.data);
        notifyMessageSent();
        console.log("success")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setKennzahlenInquiryPending = () => {
    if (!pendingReason.trim()) {
      alert("Deine Nachricht ist ein Pflichtfeld!");
      return;
    }
    axiosClient
      .put(`/kennzahlen/setKennzahlenInquiryPending/${approval._id}`, {
        pendingReason: pendingReason,
        message: "Deine Anfrage wurde in „In Prüfung“ geändert",
        status: "In Prüfung"
      })
      .then((response) => {
        return axiosClient.get("/costApproval/getUserApprovals");
      })
      .then((response) => {
        setUserApprovals(response.data);
        notifyMessageSent();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const declineKennzahlenInquiry = () => {
    if (!declineReason.trim()) {
      alert("Deine Nachricht ist ein Pflichtfeld!");
      return;
    }
    axiosClient
      .put(`/kennzahlen/declineKennzahlenInquiry/${approval._id}`, {
            declineReason: declineReason,
        message: "Deine Anfrage wurde nicht genehmigt",

        status: "Abgelehnt"
      })
      .then((response) => {
        return axiosClient.get("/costApproval/getUserApprovals");
      })
      .then((response) => {
        setUserApprovals(response.data);
        notifyMessageSent();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatExpenseAmount = (amount, cents) => {
    const amountStr = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const centsStr = cents.toString().padStart(2, "0");

    return `${amountStr},${centsStr} €`;
  };

  const notifyMessageSent = () =>
    toast.success("Deine Nachricht wurde geschickt!", {
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

  const closeModalUpdate = () => {
    if (modalRefUpdate.current) {
      modalRefUpdate.current.close();
    }
  };

  return (
    <div>
      <div className="shadow rounded-lg collapse collapse-arrow bg-white">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-xl font-medium">
          <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="flex justify-between w-full">
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline text-gray-500">
                        Art der Kosten:
                      </div>

                      <div className="text-md font-medium text-gray-900">
                        {approval.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline text-gray-500">
                        Status:
                      </div>
                      <span
                        className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          approval.status === "Neu"
                            ? "bg-blue-100 text-blue-800"
                            : approval.status === "Abgelehnt"
                            ? "bg-red-100 text-red-800"
                            : approval.status === "In Prüfung"
                            ? "bg-orange-100 text-orange-800"
                            : approval.status === "Genehmigt"
                            ? "bg-green-100 text-green-800"
                            : "bg-violet-100 text-violet-800"
                        }`}
                      >
                        {approval.status}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="flex-1  px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-md underline text-gray-500">
                        Welche Kosten entstehen:
                      </div>
                      <div className="text-lg font-medium text-gray-900">
                        {formatExpenseAmount(
                          approval.expenseAmount,
                          approval.expenseAmountCent
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="flex-1  px-6 py-4 whitespace-nowrap text-md text-gray-500">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline text-gray-500">
                        Erstellt am:
                      </div>
                      {formatDate(approval.dateOfCreation)}
                    </div>
                  </div>
                </td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline font-medium text-gray-500">
                        Datum der letzten Änderung:
                      </div>
                      <div className="text-lg font-medium text-gray-500">
                        {approval.lastUpdate.length > 0
                          ? formatDate(
                              approval.lastUpdate[
                                approval.lastUpdate.length - 1
                              ].date
                            )
                          : "-"}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="collapse-content peer-checked:block">
          <hr />

          <table className="min-w-full overflow-x-auto">
            <tbody className="bg-white">
              <tr className="flex justify-end w-full">
                <td className="flex px-12 mt-3 py-4 whitespace-nowrap text-sm font-medium">
                  {approval.status === "Innerhalb des Budgets" ? (
                    <div className="hidden"></div>
                  ) : approval.status === "Neu" || approval.status === "In Prüfung" ? (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => modalRef.current.showModal()}
                        disabled={usersName !== approval.approver}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={28}
                          viewBox="0 0 448 512"
                          className={
                            usersName !== approval.approver
                              ? "hover:cursor-not-allowed overflow-visible text-slate-500"
                              : "hover:cursor-pointer overflow-visible text-blue-500 transition-transform transform hover:scale-125 hover:text-emerald-700"
                          }
                          fill="currentColor"
                        >
                          <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z" />
                        </svg>
                      </button>

                      <dialog
                        ref={modalRef}
                        className="modal modal-bottom sm:modal-middle"
                      >
                        <div
                          className="modal-box"
                          style={{ width: "100%", maxWidth: "45%" }}
                        >
                          <div
                            role="alert"
                            className="flex items-center p-3 mb-4 text-sm text-yellow-800 border border-yellow-500 rounded-lg bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 shrink-0 stroke-current mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span>
                              Du bist dabei, die folgende Anfrage von{" "}
                              <span className="font-extrabold font-style: italic">
                                {approval.creator.firstName +
                                  " " +
                                  approval.creator.lastName}{" "}
                              </span>
                              zu genehmigen:
                            </span>
                          </div>

                          <div
                            className="flex justify-center w-full p-3 my-1 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                            role="alert"
                          >
                            <div className="flex w-full items-center">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Art der Kosten:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {approval.title}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center w-full">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Welche Kosten entstehen:
                                </div>
                                <div className="text-lg font-medium text-gray-900">
                                  {formatExpenseAmount(
                                    approval.expenseAmount,
                                    approval.expenseAmountCent
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="flex items-center w-full">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Budget nach Genehmigung:
                                </div>
                                <div className="text-lg font-medium text-gray-900">
                                {
        (() => {
          // Filter the budgets by month and department
          const matchingBudget = allKennzahlenBudgets.filter(
            (budget) =>
              budget.month === approval.month &&
              budget.department === approval.department
          );

          // Calculate remaining budget if a match is found

          const difference = matchingBudget.usedAmount + approval.expenseAmount

        {difference}

        })
      }
                                </div>
                              </div>
                            </div> */}
                            <div className="flex w-full items-center">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Zeitraum:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {formatDate(approval.dateRangeStart)} -{" "}
                                  {formatDate(approval.dateRangeEnd)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex p-3 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                            role="alert"
                          >
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm underline text-gray-500">
                                  Das Geld wird ausgegeben für:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {approval.additionalMessage}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-action">
                            <form method="dialog">
                              <div className="flex gap-2">
                                <button
                                  onClick={approveKennzahlenInquiry}
                                  className="btn bg-green-400 hover:bg-green-500"
                                >
                                  Genehmigen
                                </button>

                                <button onClick={closeModal} className="btn">
                                  Abbrechen
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </dialog>

                      <button
                        className={
                          approval.status === "In Prüfung"
                            ? "hidden"
                            : "visible"
                        }
                        onClick={() => modalRefPending.current.showModal()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={28}
                          viewBox="0 0 448 512"
                          className={
                            usersName !== approval.approver
                              ? "hover:cursor-not-allowed overflow-visible text-slate-500"
                              : "overflow-visible text-amber-400 transition-transform transform hover:scale-125 hover:text-amber-500"
                          }
                          fill="currentColor"
                        >
                          <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm0 240a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM368 321.6l0 6.4c0 8.8 7.2 16 16 16s16-7.2 16-16l0-6.4c0-5.3 4.3-9.6 9.6-9.6l40.5 0c7.7 0 13.9 6.2 13.9 13.9c0 5.2-2.9 9.9-7.4 12.3l-32 16.8c-5.3 2.8-8.6 8.2-8.6 14.2l0 14.8c0 8.8 7.2 16 16 16s16-7.2 16-16l0-5.1 23.5-12.3c15.1-7.9 24.5-23.6 24.5-40.6c0-25.4-20.6-45.9-45.9-45.9l-40.5 0c-23 0-41.6 18.6-41.6 41.6z" />
                        </svg>
                      </button>

                      <dialog
                        ref={modalRefPending}
                        className="modal modal-bottom sm:modal-middle"
                      >
                        <div
                          className="modal-box"
                          style={{ width: "60%", maxWidth: "70vh" }}
                        >
                          <div
                            role="alert"
                            className="flex items-center p-3 mb-4 text-sm text-yellow-800 border border-yellow-500 rounded-lg bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 shrink-0 stroke-current mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span>
                              Du bist dabei, die folgende Anfrage von{" "}
                              <span className="font-extrabold font-style: italic">
                                {approval.creator.firstName +
                                  " " +
                                  approval.creator.lastName}{" "}
                              </span>
                              in "In Prüfung" zu setzen:
                            </span>
                          </div>

                          <div
                            className="flex p-3 my-1 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                            role="alert"
                          >
                            <div className="flex w-full items-center">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Art der Kosten:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {approval.title}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center w-full">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Welche Kosten entstehen:
                                </div>
                                <div className="text-lg font-medium text-gray-900">
                                  {formatExpenseAmount(
                                    approval.expenseAmount,
                                    approval.expenseAmountCent
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex w-full items-center">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Zeitraum:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {formatDate(approval.dateRangeStart)} -{" "}
                                  {formatDate(approval.dateRangeEnd)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex p-3 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                            role="alert"
                          >
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm underline text-gray-500">
                                  Das Geld wird ausgegeben für:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {approval.additionalMessage}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-gray-700">
                              Zusätzliche Information:
                            </label>
                            <textarea
                              className="textarea textarea-bordered w-full mt-2"
                              value={pendingReason}
                              onChange={(e) => setPendingReason(e.target.value)}
                              placeholder={`Warum wird die Anfrage auf "In Prüfung" geändert?`}
                              required
                            />
                          </div>
                          <div className="modal-action">
                            <form method="dialog">
                              <div className="flex gap-2">
                                <button
                                  onClick={setKennzahlenInquiryPending}
                                  className="btn bg-amber-300 hover:bg-amber-500"
                                >
                                  Auf "In Prüfung" setzen
                                </button>

                                <button
                                  onClick={closeModalPending}
                                  className="btn"
                                >
                                  Abbrechen
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </dialog>

                      <button
                        className={
                          approval.status === "Abgelehnt" ||
                          approval.status === "Ja zum späteren Zeitpunkt"
                            ? "hidden"
                            : "visible"
                        }
                        onClick={() => modalRefDecline.current.showModal()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={28}
                          viewBox="0 0 448 512"
                          className={
                            usersName !== approval.approver
                              ? "hover:cursor-not-allowed overflow-visible text-slate-500"
                              : "overflow-visible text-red-500 transition-transform transform hover:scale-125 hover:text-red-700"
                          }
                          fill="currentColor"
                        >
                          <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                        </svg>
                      </button>

                      <dialog
                        ref={modalRefDecline}
                        className="modal modal-bottom sm:modal-middle"
                      >
                        <div
                          className="modal-box"
                          style={{ width: "60%", maxWidth: "70vh" }}
                        >
                          <div
                            role="alert"
                            className="flex items-center p-3 mb-4 text-sm text-yellow-800 border border-yellow-500 rounded-lg bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 shrink-0 stroke-current mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span>
                              Du bist dabei, die folgende Anfrage von{" "}
                              <span className="font-extrabold font-style: italic">
                                {approval.creator.firstName +
                                  " " +
                                  approval.creator.lastName}{" "}
                              </span>
                              zu ablehnen:
                            </span>
                          </div>

                          <div
                            className="flex p-3 my-1 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                            role="alert"
                          >
                            <div className="flex w-full items-center">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Art der Kosten:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {approval.title}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center w-full">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Welche Kosten entstehen:
                                </div>
                                <div className="text-lg font-medium text-gray-900">
                                  {formatExpenseAmount(
                                    approval.expenseAmount,
                                    approval.expenseAmountCent
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex w-full items-center">
                              <div className="ml-4">
                                <div className="text-md underline text-gray-500">
                                  Zeitraum:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {formatDate(approval.dateRangeStart)} -{" "}
                                  {formatDate(approval.dateRangeEnd)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex p-3 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                            role="alert"
                          >
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm underline text-gray-500">
                                  Das Geld wird ausgegeben für:
                                </div>

                                <div className="text-lg font-medium text-gray-900">
                                  {approval.additionalMessage}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-gray-700">
                              Grund für die Ablehnung:
                            </label>
                            <textarea
                              className="textarea textarea-bordered w-full mt-2"
                              value={declineReason}
                              onChange={(e) => setDeclineReason(e.target.value)}
                              placeholder="Gib den Ablehnungsgrund ein..."
                              required
                            />
                          </div>

                          <div className="modal-action">
                            <form method="dialog">
                              <div className="flex gap-2">
                                <button
                                  onClick={declineKennzahlenInquiry}
                                  className="btn bg-red-400 hover:bg-red-500"
                                >
                                  Ablehnen
                                </button>

                                <button
                                  onClick={closeModalDecline}
                                  className="btn"
                                >
                                  Abbrechen
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button onClick={() => modalRef.current.showModal()}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={28}
                          viewBox="0 0 448 512"
                          className="overflow-visible text-gray-600 transition-transform transform hover:cursor-not-allowed"
                          fill="currentColor"
                        >
                          <path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM224 160c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 48 48 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-48 0 0 48c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-48-48 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l48 0 0-48z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>

              <tr className="flex w-full">
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <p className="text-2xl text-center font-medium text-gray-900">
                    Benachrichtigungen
                  </p>
                </td>
              </tr>

              <tr className="flex justify-between w-full">
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="flex items-center w-14 bg-blue-100 rounded-full">
                        <span className="mt-3 flex justify-center text-blue-500 text-lg font-semibold">
                          {approval.creator.abbreviation}
                        </span>
                      </div>
                    </div>
                    <div className="chat-header">
                      {approval.creator.firstName +
                        " " +
                        approval.creator.lastName}
                      <span className="opacity-50">
                        {": " + formatDate(approval.dateOfCreation)}
                      </span>
                    </div>
                    <div className="mt-1 chat-bubble">
                      {approval.additionalMessage}
                    </div>
                  </div>
                  {approval.lastUpdate.map((update, index) => {
                    const isCreator =
                      update.sendersFirstName === approval.creator.firstName &&
                      update.sendersLastName === approval.creator.lastName;

                    return (
                      <div
                        key={index}
                        className={`chat ${
                          isCreator ? "chat-start" : "chat-end"
                        }`}
                      >
                        <div className="chat-image avatar">
                          <div className="flex items-center w-14 bg-blue-100 rounded-full">
                            <span className="mt-3 flex justify-center text-blue-500 text-lg font-semibold">
                              {isCreator
                                ? approval.creator.abbreviation
                                : update.sendersAbbreviation}
                            </span>
                          </div>
                        </div>
                        <div className="chat-header">
                          {isCreator
                            ? approval.creator.firstName +
                              " " +
                              approval.creator.lastName
                            : update.sendersFirstName +
                              " " +
                              update.sendersLastName}
                          <span className="opacity-50">
                            {": " + formatDateTime(update.date)}
                          </span>
                        </div>
                        <div className="mt-1 chat-bubble">
                          {update.message}
                          {!update.updateMessage
                            ? null
                            : `${update.updateMessage}`}
                          <br />
                          {!update.declineReason
                            ? null
                            : `Begründung: ${update.declineReason}`}
                          {!update.pendingReason
                            ? null
                            : `Begründung: ${update.pendingReason}`}
                          {!update.postponeReason
                            ? null
                            : `Begründung: ${update.postponeReason}`}
                        </div>
                      </div>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
