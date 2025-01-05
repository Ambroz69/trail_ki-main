import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateTrail from './pages/CreateTrail';
import EditTrail from './pages/EditTrail';
import DeleteTrail from './pages/DeleteTrail';
import ShowTrail from './pages/ShowTrail';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from "./ProtectedRoute";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import ResetPassword from "./pages/ResetPassword";
import ForgottenPassword from './pages/ForgottenPassword';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/trails/details/:id' element={<ShowTrail />} />
        <Route path='/trails/edit/:id' element={<CreateTrail />} />
        <Route path='/trails/remove/:id' element={<DeleteTrail />} />
        <Route path='/trails/create' element={<CreateTrail />} />
        <Route path='/users' element={<Users />} />
        <Route path='/profile' element={<UserProfile />} />
      </Route>
      <Route path='users/register' element={<Register />} />
      <Route path='users/login' element={<Login />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/forgot-password' element={<ForgottenPassword />} />
    </Routes>
  )
}

export default App;