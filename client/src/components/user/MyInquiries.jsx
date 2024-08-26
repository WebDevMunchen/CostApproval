import { useContext } from "react";
import Sidebar from "../shared/Sidebar";
import { AuthContext } from "../../context/AuthProvider";
import InquiryCard from "./InquiryCard";

export default function MyInquiries() {
  const { userApprovals } = useContext(AuthContext);

  return (
    <div>
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />
        <div className="h-[100vh] w-full bg-gray-50 relative overflow-y-auto">
          <div className="flex flex-col ml-96 w-9/12 gap-4 mt-16">
            {!userApprovals ? (
              <p>Loading...</p>
            ) : (
              userApprovals.map((approval) => {
                return <InquiryCard key={approval._id} approval={approval} />;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
