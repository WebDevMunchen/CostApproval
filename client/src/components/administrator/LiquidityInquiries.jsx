import { useContext, useState, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import { AuthContext } from "../../context/AuthProvider";
import LiquidityInquiriesCard from "./LiquidityInquiriesCard";

export default function LiquidityInquiries() {
  const {
    allLiqudityApprovals,
    selectedYearAdmin,
    setSelectedYearAdmin,
    setStatusAccounting,
  } = useContext(AuthContext);

  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const sortApprovals = (approvals) => {
    return approvals.sort((a, b) => {
      if (a.liquidityStatus === "Neu" && b.liquidityStatus !== "Neu") {
        return -1;
      } else if (b.liquidityStatus === "Neu" && a.liquidityStatus !== "Neu") {
        return 1;
      } else {
        return 0;
      }
    });
  };

  useEffect(() => {
    setStatusAccounting(selectedStatuses.join(","));
  }, [selectedStatuses, setStatusAccounting]);

  const handleYearChange = (e) => {
    setSelectedYearAdmin(e.target.value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div>
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />
        <div className="min-h-screen w-full bg-gray-50 relative">
          <div className="flex flex-col ml-96 w-9/12 gap-4 mt-10 mb-6">
            <div>
              <label className="text-lg font-semibold leading-tight tracking-tight text-gray-900 dark:text-white mb-4">
                Kostenanfragen mit Liquidität für das Jahr:
                <select
                  value={selectedYearAdmin}
                  onChange={handleYearChange}
                  className="border-gray-200 border-2 p-1 rounded-md ml-2 hover:cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </label>
            </div>
            <div className="font-semibold flex gap-2 items-center mb-2">
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

            {!allLiqudityApprovals ? (
              <p>Loading...</p>
            ) : (
              sortApprovals(allLiqudityApprovals).map((approval) => (
                <LiquidityInquiriesCard
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
