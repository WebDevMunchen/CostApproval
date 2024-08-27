import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/administrator/AdminDashboard";
import Navbar from "./components/shared/Navbar";
import InquiryForm from "./components/user/InquiryForm";
import MyInquiries from "./components/user/MyInquiries";
import Protected from "./context/Protected";
import Login from "./components/shared/Login";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthProvider";
import EditInquiry from "./components/user/EditInquiry";
import Authorize from "./context/Authorize";

function App() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/meineAnfragen");
    }
  }, [user, navigate]);
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Protected />}>
          <Route path="/meineAnfragen" element={<MyInquiries />} />
          <Route path="/anfrageBearbeiten/:id" element={<EditInquiry />} />
          <Route path="/neueAnfrage" element={<InquiryForm />} />
          <Route path="/admin" element={<Authorize role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
