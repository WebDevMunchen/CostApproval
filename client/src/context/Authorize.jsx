import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function Authorize({ role }) {
  const { user } = useContext(AuthContext);

  return <>{user.role === role ? <Outlet /> : <Navigate to={"/"} />}</>;
}