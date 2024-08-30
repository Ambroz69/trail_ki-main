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

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/trails/details/:id' element={<ShowTrail />} />
        <Route path='/trails/edit/:id' element={<EditTrail />} />
        <Route path='/trails/remove/:id' element={<DeleteTrail />} />
        <Route path='/trails/create' element={<CreateTrail />} />
      </Route>
      <Route path='users/register' element={<Register />} />
      <Route path='users/login' element={<Login />} />
    </Routes>
  )
}

export default App;