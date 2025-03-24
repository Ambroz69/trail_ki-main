import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateTrail from './pages/CreateTrail';
import DeleteTrail from './pages/DeleteTrail';
import ShowTrail from './pages/ShowTrail';
import CertificationTrail from './pages/CertificationTrail';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from "./ProtectedRoute";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import ResetPassword from "./pages/ResetPassword";
import ForgottenPassword from './pages/ForgottenPassword';
import HomeUser from './pages/HomeUser';
import TitlePage from './pages/TitlePage';
import ShowTrailUser from './pages/ShowTrailUser';
import ExplorerJourney from './pages/ExplorerJourney';
import Leaderboard from './pages/Leaderboard';
import Practice from './pages/Practice';
import Certificate from './pages/Certificate';
import CertificatesLibrary from './pages/CertificatesLibrary';

const App = () => {
  return (
    <Routes>
      {/* Public Routes*/}
      <Route path='users/register' element={<Register />} />
      <Route path='users/login' element={<Login />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/forgot-password' element={<ForgottenPassword />} />
      
      

      {/* Redirect to correct home pages based on role */}
      <Route path='/' element={<ProtectedRoute />} />

      {/* User Routes */}
      <Route path='explorer' element={<ProtectedRoute requiredRole="explorer" />}>
        <Route index element={<HomeUser />} />
        <Route path='trails/details/:id' element={<ShowTrailUser />} />
        <Route path='trails/certification/:id' element={<CertificationTrail />} />
        <Route path='profile' element={<UserProfile />} />
        <Route path='journey' element={<ExplorerJourney />} />
        <Route path='leaderboard' element={<Leaderboard />} />
        <Route path='practice' element={<Practice />} />
        <Route path='certificate/:id' element={<Certificate />} />
        <Route path='certificates' element={<CertificatesLibrary />} />
      </Route>

      {/* Trail Creator Routes */}
      <Route path='creator' element={<ProtectedRoute requiredRole="trail creator" />}>
        <Route index element={<Home />} />
        <Route path='homeuser' element={<HomeUser />} />
        <Route path='trails/details/:id' element={<ShowTrailUser />} />
        <Route path='trails/edit/:id' element={<CreateTrail />} />
        <Route path='trails/remove/:id' element={<DeleteTrail />} />
        <Route path='trails/create' element={<CreateTrail />} />
        <Route path='trails/certification/:id' element={<CertificationTrail />} />
        <Route path='profile' element={<UserProfile />} />
        <Route path='journey' element={<ExplorerJourney />} />
        <Route path='leaderboard' element={<Leaderboard />} />
        <Route path='practice' element={<Practice />} />
        <Route path='certificate/:id' element={<Certificate />} />
        <Route path='certificates' element={<CertificatesLibrary />} />
      </Route>

      {/* Manager Routes */}
      <Route path='manager' element={<ProtectedRoute requiredRole="manager" />}>
        <Route index element={<Home />} />
        <Route path='homeuser' element={<HomeUser />} />
        <Route path='trails/details/:id' element={<ShowTrailUser />} />
        <Route path='trails/edit/:id' element={<CreateTrail />} />
        <Route path='trails/remove/:id' element={<DeleteTrail />} />
        <Route path='trails/create' element={<CreateTrail />} />
        <Route path='trails/certification/:id' element={<CertificationTrail />} />
        <Route path='users' element={<Users />} />
        <Route path='profile' element={<UserProfile />} />
        <Route path='journey' element={<ExplorerJourney />} />
        <Route path='leaderboard' element={<Leaderboard />} />
        <Route path='practice' element={<Practice />} />
        <Route path='certificate/:id' element={<Certificate />} />
        <Route path='certificates' element={<CertificatesLibrary />} />
      </Route>

      {/* Default Redirect */}
      <Route path='*' element={<TitlePage />} />
      
    </Routes>
  )
}

export default App;