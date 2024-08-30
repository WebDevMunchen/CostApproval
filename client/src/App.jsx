import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/administrator/AdminDashboard";
import Navbar from "./components/shared/Navbar";
import InquiryForm from "./components/user/InquiryForm";
import MyInquiries from "./components/user/MyInquiries";
import Protected from "./context/Protected";
import Login from "./components/shared/Login";
import EditInquiry from "./components/user/EditInquiry";
import Authorize from "./context/Authorize";
import Budget from "./components/administrator/Budget";
import Inquiries from "./components/administrator/Inquiries";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Protected />}>
          <Route path="/meineAnfragen" element={<MyInquiries />} />
          <Route path="/anfrageBearbeiten/:id" element={<EditInquiry />} />
          <Route path="/neueAnfrage" element={<InquiryForm />} />
          <Route
            path="/admin"
            element={<Authorize roles={["admin", "accounting"]} />}
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="budgetVerwalten" element={<Budget />} />
            <Route path="kostenanfragen" element={<Inquiries />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
