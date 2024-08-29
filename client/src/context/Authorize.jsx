import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function Authorize({ roles }) {
  const { user } = useContext(AuthContext);

  return <>{roles.includes(user.role) ? <Outlet /> : <Navigate to={"/"} />}</>;
}