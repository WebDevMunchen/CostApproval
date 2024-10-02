import { useContext, useState, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import { AuthContext } from "../../context/AuthProvider";
import KennzahlEntryCardAdmin from "./KennzahlEntryCardAdmin";
import axiosClient from "../../utils/axiosClient";

export default function KennzahlenEntriesAdmin() {
  const { setStatus, setTitleSearch, user } = useContext(AuthContext);

  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [allKennzahlenInquiries, setAllKennzahlenInquiries] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("Anmietung");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setStatus(selectedStatuses.join(","));

    axiosClient
      .get(
        `/kennzahlen/getAllKennzahlenInquiries?year=${selectedYear}&department=${selectedDepartment}&status=${selectedStatuses}`
      )
      .then((response) => {
        setAllKennzahlenInquiries(response.data);
      })
      .catch(() => {
        setAllKennzahlenInquiries(null);
      });
  }, [selectedStatuses, setStatus, selectedDepartment, selectedYear]);

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
    setTitleSearch("");
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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

  const departments = [
    "Anmietung",
    "Projektbezogene Fremdpersonalkosten",
    "Fremdpersonalkosten LL",
    "Projektbezogene Fremdtransportkosten",
    "Transportkosten/Umschlag",
  ];

  return (
    <div>
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />
        <div className="min-h-screen w-full bg-gray-50 relative">
          <div className="flex flex-col ml-80 w-9/12 gap-4 mt-10 mb-6">
            <div className="flex justify-between">
              <div>
                <label className="text-lg font-semibold leading-tight tracking-tight text-gray-900 dark:text-white mb-4">
                  Anfragen nach Budgetüberschreitung:
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="border-gray-200 border-2 p-1 rounded-md ml-2 hover:cursor-pointer"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="text-lg font-semibold leading-tight tracking-tight text-gray-900 dark:text-white mb-4">
                  Abteilung:
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border-gray-200 border-2 p-1 rounded-md ml-2 hover:cursor-pointer"
                  >
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:black] checked:border-indigo-800"
                  checked={selectedStatuses.includes("Innerhalb des Budgets")}
                  onChange={() => handleStatusChange("Innerhalb des Budgets")}
                />
                <span className="ml-2">Innerhalb des Budgets</span>
              </label>
            </div>
            {!allKennzahlenInquiries ? (
              <p>Loading...</p>
            ) : (
              sortApprovals(allKennzahlenInquiries).map((approval) => {
                return (
                  <KennzahlEntryCardAdmin
                    key={approval._id}
                    approval={approval}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
