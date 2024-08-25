import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar/>
    <App />
  </BrowserRouter>
)
