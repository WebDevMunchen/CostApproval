import { useContext, useState, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import { AuthContext } from "../../context/AuthProvider";
import InquiryCardAdmin from "./InquiryCardAdmin";

export default function Inquiries() {
  const {
    allApprovalsAdmin,
    selectedYearAdmin,
    setSelectedYearAdmin,
    setStatus,
  } = useContext(AuthContext);

  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    setStatus(selectedStatuses.join(","));
  }, [selectedStatuses, setStatus]);

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleYearChange = (e) => {
    setSelectedYearAdmin(e.target.value);
  };

  const sortApprovals = (approvals) => {
    return approvals.sort((a, b) => {
      if (a.status === "Neu" && b.status !== "Neu") {
        return -1;
      } else if (b.status === "Neu" && a.status !== "Neu") {
        return 1;
      } else {
        return 0;
      }
    });
  };

  return (
    <div>
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />
        <div className="h-[100vh] w-full bg-gray-50 relative overflow-y-auto">
          <div className="flex flex-col ml-96 w-9/12 gap-4 mt-16">
            <div>
              <label className="text-lg font-semibold leading-tight tracking-tight text-gray-900 dark:text-white mb-4">
                Kostenanfragen für das Jahr:
                <select
                  value={selectedYearAdmin}
                  onChange={handleYearChange}
                  className="border-gray-200 border-2 p-1 rounded-md ml-2 hover:cursor-pointer"
                >
                  {/* Add years dynamically or statically */}
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  {/* Add more years as needed */}
                </select>
              </label>
            </div>
            <div className="flex gap-2 items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-info"
                  checked={selectedStatuses.includes("Neu")}
                  onChange={() => handleStatusChange("Neu")}
                />
                <span className="ml-2">Neu</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-success"
                  checked={selectedStatuses.includes("Genehmigt")}
                  onChange={() => handleStatusChange("Genehmigt")}
                />
                <span className="ml-2">Genehmigt</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-warning"
                  checked={selectedStatuses.includes("In Prüfung")}
                  onChange={() => handleStatusChange("In Prüfung")}
                />
                <span className="ml-2">In Prüfung</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-error"
                  checked={selectedStatuses.includes("Abgelehnt")}
                  onChange={() => handleStatusChange("Abgelehnt")}
                />
                <span className="ml-2">Abgelehnt</span>
              </label>
            </div>

            {!allApprovalsAdmin ? (
              <p>Loading...</p>
            ) : (
              sortApprovals(allApprovalsAdmin).map((approval) => (
                <InquiryCardAdmin
                  key={approval._id}
                  approval={approval}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
