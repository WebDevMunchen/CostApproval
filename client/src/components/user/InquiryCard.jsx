import { NavLink } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InquiryCard({ approval }) {
  const { setUserApprovals } = useContext(AuthContext);

  const modalRef = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  };

  const deleteApproval = () => {
    axiosClient
      .delete(`/costApproval/${approval._id}`)
      .then((response) => {
        return axiosClient.get("/costApproval/getUserApprovals");
      })
      .then((response) => {
        setUserApprovals(response.data);
        notifySuccessDeleted();
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

  const notifySuccessDeleted = () =>
    toast.success("Anfrage gelöscht!", {
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

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
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
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="flex justify-between w-full">
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm underline font-medium text-gray-500">
                        Wird genehmigt von:
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
                        {approval.lastUpdate.length > 0
                          ? formatDate(
                              approval.lastUpdate[
                                approval.lastUpdate.length - 1
                              ].date
                            )
                          : "Noch keine Antwort"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="flex-1 px-6 mt-3 py-4 whitespace-nowrap  text-sm font-medium">
                  {approval.status === "Neu" &&
                  (approval.liquidityStatus === "In Prüfung" ||
                    approval.liquidity === false) ? (
                    <div className="flex justify-center gap-4">
                      <NavLink to={`/anfrageBearbeiten/${approval._id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={28}
                          viewBox="0 0 512 512"
                          className="transition-transform transform hover:scale-125 hover:text-blue-600"
                          fill="currentColor"
                        >
                          <path d="M373.5 27.1C388.5 9.9 410.2 0 433 0c43.6 0 79 35.4 79 79c0 22.8-9.9 44.6-27.1 59.6L277.7 319l-10.3-10.3-64-64L193 234.3 373.5 27.1zM170.3 256.9l10.4 10.4 64 64 10.4 10.4-19.2 83.4c-3.9 17.1-16.9 30.7-33.8 35.4L24.3 510.3l95.4-95.4c2.6 .7 5.4 1.1 8.3 1.1c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32c0 2.9 .4 5.6 1.1 8.3L1.7 487.6 51.5 310c4.7-16.9 18.3-29.9 35.4-33.8l83.4-19.2z" />
                        </svg>
                      </NavLink>
                      <button onClick={() => modalRef.current.showModal()}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={28}
                          viewBox="0 0 448 512"
                          className="text-orange-400 transition-transform transform hover:scale-125 hover:text-red-600"
                          fill="currentColor"
                        >
                          <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
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
                            className="flex items-center wrap p-3 mb-4 text-sm text-yellow-800 border border-yellow-500 rounded-lg bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
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
                              Sie sind dabei, die folgende Anfrage zu löschen.
                            </span>

                            <p className="ml-1">
                              Nach der Bestätigung wirst du sie nicht mehr
                              wiederherstellen können:
                            </p>
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

                            <div className="flex items-center w-full">
                              <div className="ml-4">
                                <div className="text-sm underline font-medium text-gray-500">
                                  Die Kosten genehmigt:
                                </div>
                                <div className="text-lg font-medium text-gray-900">
                                  {approval.approver}
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
                                  onClick={deleteApproval}
                                  className="btn bg-red-400 hover:bg-red-500"
                                >
                                  Löschen
                                </button>

                                <button onClick={closeModal} className="btn">
                                  Abbrechen
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  ) : (
                    <div className="flex-1 invisible">Placeholder</div>
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
                            {": " + formatDate(update.date)}
                          </span>
                        </div>
                        <div className="mt-1 chat-bubble">
                          {update.message}
                          <br />
                          {!update.declineReason
                            ? null
                            : `Begrundung: ${update.declineReason}`}
                          {!update.pendingReason
                            ? null
                            : `Begrundung: ${update.pendingReason}`}
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
