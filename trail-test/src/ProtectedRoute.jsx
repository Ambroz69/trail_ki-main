import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// receives component and any other props represented by ...rest
const ProtectedRoute = () => {
  // get cookie from browser if logged in
  const token = cookies.get("SESSION_TOKEN");

  try {
    const arrayToken = token.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const verified = (tokenPayload?.userVerified || '');

    // returns route if there is a valid token set in the cookie or the landing page if there is no valid token set
    return verified ? <Outlet /> : <Navigate to="/users/login" />
  } catch (error) {
    console.error(error);
    return <Navigate to="/users/login" />; // send to login if issues with token
  }
}

export default ProtectedRoute;