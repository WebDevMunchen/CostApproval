import axiosClient from "../../utils/axiosClient";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function KennzahlEntryCard({ approval }) {
  const { setUserApprovals } = useContext(AuthContext);

  const [updateMessage, setUpdateMessage] = useState("");

  const modalRefUpdate = useRef(null);

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

  const updateInquiry = () => {
    if (!updateMessage.trim()) {
      alert("Deine Nachricht ist ein Pflichtfeld!");
      return;
    }
    axiosClient
      .put(`/costApproval/updateInquiry/${approval._id}`, {
        updateMessage: updateMessage,
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
                  ) : approval.status === "In Prüfung" ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => modalRefUpdate.current.showModal()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={28}
                          viewBox="0 0 448 512"
                          className="overflow-visible text-blue-600 transition-transform transform hover:scale-125 hover:text-blue-800"
                          fill="currentColor"
                        >
                          <path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM224 160c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 48 48 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-48 0 0 48c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-48-48 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l48 0 0-48z" />
                        </svg>
                      </button>

                      <dialog
                        ref={modalRefUpdate}
                        className="modal modal-bottom sm:modal-middle"
                      >
                        <div
                          className="modal-box"
                          style={{ width: "100%", maxWidth: "42%" }}
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
                              Mehr Informationen wird benötigt, um deine Anfrage
                              zu Genehmigen.
                            </span>

                            <p className="ml-1">
                              Gib deine Nachricht im Textfeld unten.
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
                          <div className="mt-4">
                            <label className="block font-medium text-gray-700">
                              Zusätzliche Information:
                            </label>
                            <textarea
                              className="textarea font-medium textarea-bordered w-full mt-2"
                              value={updateMessage}
                              onChange={(e) => setUpdateMessage(e.target.value)}
                              placeholder={`Gib deine Nachricht hier...`}
                              required
                            />
                          </div>
                          <div className="modal-action">
                            <form method="dialog">
                              <div className="flex gap-2">
                                <button
                                  onClick={updateInquiry}
                                  className="btn bg-green-400 hover:bg-green-500"
                                >
                                  Senden
                                </button>

                                <button
                                  onClick={closeModalUpdate}
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
                      <button
                        onClick={() => modalRefUpdate.current.showModal()}
                      >
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
