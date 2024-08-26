import { Routes, Route } from "react-router-dom";
// import AdminDashboard from "./components/administrator/AdminDashboard";
import Navbar from "./components/shared/Navbar";
import InquryForm from "./components/user/InquiryForm";
import MyInquiries from "./components/user/MyInquiries";
import Protected from "./context/Protected";
import Login from "./components/shared/Login";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />}/>


        <Route path="/" element={<Protected />}>
          <Route path="/meineAnfragen" element={<MyInquiries />} />
          <Route path="/neueAnfrage" element={<InquryForm />} />
        </Route>
        {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </>
  );
}

export default App;
