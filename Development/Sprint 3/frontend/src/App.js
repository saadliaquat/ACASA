// src/App.js
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import Login from './components/authentication/login.js';
import Register from './components/authentication/signup.js';
import  Dashboard from './components/dashboard.js';
import GenerateComplianceReport from './components/compliancereport.js';
import FirewallAnalysis from './components/technological controls/firewall.js';
import FirewallStatus from './components/technological controls/firewall_status'
import AntivirusCheck from './components/technological controls/antivirus_check'
import IsmsPolicy from './components/policy generation/ISMSpolicy.js';
import DiskEncryptionAnalysis from "./components/technological controls/disk_encryption.js";
import OpenPortsAnalysis from "./components/technological controls/open_ports.js";
import RiskyProcessesAnalysis from "./components/technological controls/risky_process.js";
import HighResourceUsageAnalysis from "./components/technological controls/resource_usage.js";
import LatestUpdatesAnalysis from "./components/technological controls/latest_updates.js";
import AdBlockCheck from './components/technological controls/ad_blocker';
import IncognitoCookiesCheck from './components/technological controls/incognito_cookies';
import MaliciousSiteCheck from './components/technological controls/malicious_phishing_site';
import RequestLimitCheck from './components/technological controls/request_limit';
import SafeBrowsingCheck from './components/technological controls/safe_browsing';
import ThirdPartyCookiesCheck from './components/technological controls/thirdparty_cookies';
import UserAccountManagement from './components/technological controls/user_account_mgmt'
import MalwarePolicy from './components/policy generation/malwarepolicy.js';
import PrivilegedAccessPolicy from './components/policy generation/PriveledgedAccessPolicy.js';
import FullReport from './components/reports/generate-report'


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
              <Route path="/full-report" element={<FullReport/>}/> 

          </Routes>
        </BrowserRouter>
      
  );
}

export default App;
