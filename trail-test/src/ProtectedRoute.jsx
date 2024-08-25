import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// receives component and any other props represented by ...rest
const ProtectedRoute = () => {
  // get cookie from browser if logged in
  const token = cookies.get("SESSION_TOKEN");

  // returns route if there is a valid token set in the cookie or the landing page if there is no valid token set
  return token ? <Outlet /> : <Navigate to="/users/login" />
}

export default ProtectedRoute;