// src/App.js
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import Login from './components/login.js';
import Register from './components/signup.js';
import  Dashboard from './components/dashboard.js';
import GenerateComplianceReport from './components/compliancereport';


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element ={<Login/>}/>
              <Route path = "/dashboard" element = {< Dashboard/>}/>
              <Route path = "/generate-report" element={<GenerateComplianceReport/>}/>
          </Routes>
        </BrowserRouter>
      
  );
}

export default App;
