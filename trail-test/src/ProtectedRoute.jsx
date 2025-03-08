import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import TitlePage from "./pages/TitlePage";

// receives component and any other props represented by ...rest
const ProtectedRoute = ({ requiredRole }) => {
  // get cookie from browser if logged in
  const token = cookies.get("SESSION_TOKEN");

  try {
    if (!token) {
      return <TitlePage />; // Show the title page if no token is found
    }
    const arrayToken = token.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const userRole = tokenPayload?.userRole || 'explorer';
    const verified = (tokenPayload?.userVerified || false);
    //console.log(userRole);

    // returns route if there is a valid token set in the cookie or the landing page if there is no valid token set
    if (!verified) {
      return <TitlePage />; // Show the title page if the user is not verified
    }

    // **Redirect users to their correct home pages based on role**
    /*if (!requiredRole) {
      // If the user is already logged in but trying to access "/", redirect to correct home
      if (userRole === "user") return <Navigate to="/homeuser" replace />;
      if (userRole === "trail creator") return <Navigate to="/home" replace />;
      if (userRole === "manager") return <Navigate to="/manager" replace />;
    }

    // **Ensure the user has the right role to access the page**
    if (requiredRole && userRole !== requiredRole) {
      // Redirect users back to their allowed home pages if they try to access an unauthorized page
      if (userRole === "user") return <Navigate to="/homeuser" replace />;
      if (userRole === "trail creator") return <Navigate to="/home" replace />;
      if (userRole === "manager") return <Navigate to="/manager" replace />;
    }*/

    // **If no requiredRole is specified, redirect user based on role**
    if (!requiredRole) {
      if (userRole === "explorer") return <Navigate to="/explorer" replace />;
      if (userRole === "trail creator") return <Navigate to="/creator" replace />;
      if (userRole === "manager") return <Navigate to="/manager" replace />;
    }

    // **Allow access if the role matches OR if the user is a manager (managers have full access)**
    if (userRole === "manager" || userRole === requiredRole) {
      return <Outlet />;
    }

    // **Redirect users to their allowed home pages if they try to access an unauthorized page**
    if (userRole === "explorer") return <Navigate to="/explorer" replace />;
    if (userRole === "trail creator") return <Navigate to="/creator" replace />;
    if (userRole === "manager") return <Navigate to="/manager" replace />;

    //return <Outlet />; // Allow access to protected routes

  } catch (error) {
    console.error(error);
    return <TitlePage />; // If there's an error, show the title page
  }
}

export default ProtectedRoute;