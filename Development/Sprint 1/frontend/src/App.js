// src/App.js
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import Login from './components/login.js';
import Register from './components/signup.js';
import  Dashboard from './components/dashboard.js';
import GenerateComplianceReport from './components/compliancereport';
import FirewallAnalysis from './components/firewall';
import FirewallStatus from './components/firewall_status'
import AntivirusCheck from './components/antivirus_check'
import IsmsPolicy from './components/ISMSpolicy.js';
import DiskEncryptionAnalysis from "./components/disk_encryption.js";
import OpenPortsAnalysis from "./components/open_ports.js";
import RiskyProcessesAnalysis from "./components/risky_process.js";
import HighResourceUsageAnalysis from "./components/resource_usage.js";
import LatestUpdatesAnalysis from "./components/latest_updates.js";


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element ={<Login/>}/>
              <Route path = "/dashboard" element = {< Dashboard/>}/>
              <Route path = "/generate-report" element={<GenerateComplianceReport/>}/>
              <Route path = "/firewall-config" element={<FirewallAnalysis/>}/>
              <Route path = "/firewall-status" element={<FirewallStatus/>}/>
              <Route path = "/antivirus-check" element={<AntivirusCheck/>}/>
              <Route path = "/policy/ISMS" element={<IsmsPolicy />}/>
              <Route path = "/disk-encryption" element={<DiskEncryptionAnalysis/>}/>
              <Route path = "/open-ports" element={<OpenPortsAnalysis/>}/>
              <Route path = "/risky-processes" element={<RiskyProcessesAnalysis/>}/>
              <Route path = "/high-resource-usage" element={<HighResourceUsageAnalysis/>}/>
              <Route path = "/latest-updates" element={<LatestUpdatesAnalysis/>}/>
          </Routes>
        </BrowserRouter>
      
  );
}

export default App;
