import { useContext } from "react";
import Sidebar from "../shared/Sidebar";
import { AuthContext } from "../../context/AuthProvider";
import LiquidityInquiriesCard from "./LiquidityInquiriesCard";

export default function LiquidityInquiries() {
  const { allLiqudityApprovals, selectedMonthAdmin, selectedYearAdmin } = useContext(AuthContext);

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
            {!allLiqudityApprovals ? (
              <p>Loading...</p>
            ) : (
              sortApprovals(allLiqudityApprovals).map((approval) => (
                <LiquidityInquiriesCard key={approval._id} approval={approval} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
