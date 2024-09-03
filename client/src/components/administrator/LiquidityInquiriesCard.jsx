import { useContext, useRef, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { AuthContext } from "../../context/AuthProvider";

export default function LiquidityInquiriesCard({ approval }) {
  const { setAllApprovalsAdmin, selectedYearAdmin, status, user } =
    useContext(AuthContext);

  const modalRef = useRef(null);
  const modalRefDecline = useRef(null);
  const modalRefPending = useRef(null);

  const [liquidityDeclineReason, setLiquidityDeclineReason] = useState("");
  const [liquidityPendingReason, setLiquidityPendingReason] = useState("");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  };

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

  const approveLiqudity = () => {
    axiosClient
      .put(`/costApproval/approveLiquidity/${approval._id}`, {
        status: "Genehmigt",
        message: "Deine Liquidität wurde genehmigt",
      })
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const declineLiqudity = () => {
    axiosClient
      .put(`/costApproval/declineLiquidity/${approval._id}`, {
        status: "Abgelehnt",
        message: "Deine Liquidität wurde abgelehnt",
        liquidityDeclineReason,
      })
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const setLiquidityPending = () => {
    axiosClient
      .put(`/costApproval/setLiquidityPending/${approval._id}`, {
        status: "Abgelehnt",
        message: "Deine Liquidität wurde abgelehnt",
        liquidityPendingReason,
      })
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const formatExpenseAmount = (amount, cents) => {
    const amountStr = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const centsStr = cents.toString().padStart(2, "0");

    return `${amountStr},${centsStr} €`;
  };

  return (
    <div>
      <div className="shadow rounded-lg collapse collapse-arrow bg-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-xl font-medium">
          <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="flex justify-between w-full">
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline text-gray-500">
                        Artbeschreibung:
                      </div>

                      <div className="text-md font-medium text-gray-900">
                        {approval.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="text-sm underline text-gray-500">
                    Art der Kosten:
                  </div>

                  <div className="text-md text-gray-900">
                    {approval.typeOfExpense}
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
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {approval.status === "Neu"
                          ? "Ausstehend"
                          : approval.status}
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
                        Liquidität:
                      </div>
                      <div className="text-lg font-medium text-gray-900">
                        <span
                          className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                            approval.liquidity === false
                              ? "bg-lime-100 text-lime-800"
                              : approval.liquidityStatus === "Genehmigt"
                              ? "bg-green-100 text-green-800"
                              : approval.liquidityStatus === "Abgelehnt"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {approval.liquidity === false
                            ? "Nicht benötigt"
                            : approval.liquidityStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="collapse-content">
          <hr />

          <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
            <tbody className="bg-white">
              <tr className="flex justify-between w-full">
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline font-medium text-gray-500">
                        Ersteller:
                      </div>
                      <div className="text-lg font-medium text-gray-900">
                        {approval.creator.firstName +
                          " " +
                          approval.creator.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">

<div className="flex items-center">
    <div className="ml-4">
      <div className="text-sm underline font-medium text-gray-500">
        Wer soll die Kosten genehmigen:
      </div>
      <div className="text-lg font-medium text-gray-900">
        {approval.approver}
      </div>
    </div>
  </div>
</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline font-medium text-gray-500">
                        Priorität:
                      </div>
                      <div
                        className={`${
                          approval.priority === "Dringend"
                            ? "bg-red-100 text-red-800"
                            : approval.priority === "Mittel"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        } mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full`}
                      >
                        {approval.priority}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline font-medium text-gray-500">
                        Genehmigungsfrist:
                      </div>
                      <div className="text-lg font-medium text-gray-500">
                        {formatDate(approval.deadline)}
                      </div>
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
                        {approval.lastUpdate.length === 0
                          ? "Noch keine Antwort"
                          : formatDate(
                              approval.lastUpdate[
                                approval.lastUpdate.length - 1
                              ].date
                            )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="flex-1 pr-16 mt-3 py-4 whitespace-nowrap text-sm font-medium">
                {user.role === "accounting" ? 
                  <div className="flex justify-center gap-4">
                    
                    <button
                      className={
                        approval.liquidityStatus === "Genehmigt"
                          ? "hidden"
                          : "visible"
                      }
                      onClick={() => modalRef.current.showModal()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={28}
                        viewBox="0 0 448 512"
                        className="overflow-visible text-blue-500 transition-transform transform hover:scale-125 hover:text-emerald-700"
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
                            Du bist dabei, die Liqudität der Anfrage von{" "}
                            <span className="font-extrabold font-style: italic">
                              {approval.creator.firstName +
                                " " +
                                approval.creator.lastName}{" "}
                            </span>
                            zu genehmigen:
                          </span>
                        </div>

                        <div
                          className="flex p-3 my-1 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                          role="alert"
                        >
                          <div className="flex items-center w-full">
                            <div className="ml-4">
                              <div className="text-md underline text-gray-500">
                                Art der Kosten:
                              </div>

                              <div className="text-lg font-medium text-gray-900">
                                {approval.typeOfExpense}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center w-full">
                            <div className="ml-4">
                              <div className="text-md underline text-gray-500">
                                Artbeschreibung:
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
                        </div>
                        <div
                          className="flex p-3 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                          role="alert"
                        >
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm underline text-gray-500">
                                Was wird benötigt?
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
                                onClick={approveLiqudity}
                                className="btn bg-emerald-300 hover:bg-emerald-500"
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
                        approval.liquidityStatus === "In Prüfung"
                          ? "hidden"
                          : "visible"
                      }
                      onClick={() => modalRefPending.current.showModal()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={28}
                        viewBox="0 0 448 512"
                        className="overflow-visible text-amber-400 transition-transform transform hover:scale-125 hover:text-amber-500"
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
                            Du bist dabei, die Liqudität der Anfrage von
                          {" "}
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
                          <div className="flex items-center w-full">
                            <div className="ml-4">
                              <div className="text-md underline text-gray-500">
                                Art der Kosten:
                              </div>

                              <div className="text-lg font-medium text-gray-900">
                                {approval.typeOfExpense}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center w-full">
                            <div className="ml-4">
                              <div className="text-md underline text-gray-500">
                                Artbeschreibung:
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
                        </div>
                        <div
                          className="flex p-3 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                          role="alert"
                        >
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm underline text-gray-500">
                                Was wird benötigt?
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
                            value={liquidityPendingReason}
                            onChange={(e) => setLiquidityPendingReason(e.target.value)}
                            placeholder={`Warum wird die Anfrage auf "In Prüfung" geändert?`}
                            required
                          />
                        </div>
                        <div className="modal-action">
                          <form method="dialog">
                            <div className="flex gap-2">
                              <button
                                onClick={setLiquidityPending}
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
                        approval.liquidityStatus === "Abgelehnt"
                          ? "hidden"
                          : "visible"
                      }
                      onClick={() => modalRefDecline.current.showModal()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={28}
                        viewBox="0 0 448 512"
                        className="overflow-visible text-red-500 transition-transform transform hover:scale-125 hover:text-red-700"
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
                            Du bist dabei, die Liqudität der folgende Anfrage
                            von{" "}
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
                          <div className="flex items-center w-full">
                            <div className="ml-4">
                              <div className="text-md underline text-gray-500">
                                Art der Kosten:
                              </div>

                              <div className="text-lg font-medium text-gray-900">
                                {approval.typeOfExpense}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center w-full">
                            <div className="ml-4">
                              <div className="text-md underline text-gray-500">
                                Artbeschreibung:
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
                        </div>
                        <div
                          className="flex p-3 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-blue-400"
                          role="alert"
                        >
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm underline text-gray-500">
                                Was wird benötigt?
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
                            value={liquidityDeclineReason}
                            onChange={(e) => setLiquidityDeclineReason(e.target.value)}
                            placeholder="Gib den Ablehnungsgrund ein..."
                            required
                          />
                        </div>

                        <div className="modal-action">
                          <form method="dialog">
                            <div className="flex gap-2">
                              <button
                                onClick={declineLiqudity}
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
                :                   <div className="flex text-xl text-red-600 justify-center gap-4">
                  Nicht berechtigt
</div>
              } 
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
                        {": " + formatDateTime(approval.dateOfCreation)}
                      </span>
                    </div>
                    <div className="mt-1 chat-bubble">
                      {approval.additionalMessage}
                    </div>
                  </div>
                  {approval.lastUpdate.map((update) => {
                    return (
                      <div className="chat chat-end">
                        <div className="chat-image avatar">
                          <div className="flex items-center w-14 bg-blue-100 rounded-full">
                            <span className="mt-3 flex justify-center text-blue-500 text-lg font-semibold">
                              {update.sendersAbbreviation}
                            </span>
                          </div>
                        </div>
                        <div className="chat-header">
                          {update.sendersFirstName +
                            " " +
                            update.sendersLastName}
                          <span className="opacity-50">
                            {": " + formatDateTime(update.date)}
                          </span>
                        </div>
                        <div className="mt-1 chat-bubble">{update.message}</div>
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
