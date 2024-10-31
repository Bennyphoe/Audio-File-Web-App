import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("sessionKey")
  return isAuthenticated ? <Outlet /> : <Navigate to={"/"}/>  
}

export default ProtectedRoute