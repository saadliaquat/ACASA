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
import AdBlockCheck from './components/ad_blocker';
import IncognitoCookiesCheck from './components/incognito_cookies';
import MaliciousSiteCheck from './components/malicious_phishing_site';
import RequestLimitCheck from './components/request_limit';
import SafeBrowsingCheck from './components/safe_browsing';
import ThirdPartyCookiesCheck from './components/thirdparty_cookies';
import MalwarePolicy from './components/malwarepolicy.js';
import PrivilegedAccessPolicy from './components/PriveledgedAccessPolicy.js';
import UserAccountManagement from './components/user_account_mgmt'


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
              <Route path = "/policy/malware" element={<MalwarePolicy/>}/>
              <Route path = "/policy/privileged-access" element={<PrivilegedAccessPolicy/>}/>
              <Route path = "/disk-encryption" element={<DiskEncryptionAnalysis/>}/>
              <Route path = "/open-ports" element={<OpenPortsAnalysis/>}/>
              <Route path = "/risky-processes" element={<RiskyProcessesAnalysis/>}/>
              <Route path = "/high-resource-usage" element={<HighResourceUsageAnalysis/>}/>
              <Route path = "/latest-updates" element={<LatestUpdatesAnalysis/>}/>
              <Route path = "/ad-block" element={<AdBlockCheck/>}/>
              <Route path = "/incognito-check" element={<IncognitoCookiesCheck/>}/>
              <Route path = "/malicious-phishing" element={<MaliciousSiteCheck/>}/>
              <Route path = "/request-limit" element={<RequestLimitCheck/>}/>
              <Route path = "/safe-browsing" element={<SafeBrowsingCheck/>}/>
              <Route path = "/third-party-cookies" element={<ThirdPartyCookiesCheck/>}/>
              <Route path = "/user-account-mgmt" element={<UserAccountManagement/>}/>
          </Routes>
        </BrowserRouter>
      
  );
}

export default App;
