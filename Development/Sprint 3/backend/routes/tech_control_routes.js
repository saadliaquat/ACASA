import express from 'express';
import {
  firewallRules,
  diskEncryption,
  openPorts,
  checkAntivirus,
  firewallStatus,
  riskyProcesses,
  highResourceUsage,
  latestUpdates,
  adblockStatus,
  incognitoCookies,
  requestLimit,
  thirdPartyCookies,
  maliciousPhishingSite,
  userAccountMgmt,
  safeBrowsing
} from '../controllers/tech_controls.js';

const app = express.Router();

app.get('/firewall_rules', firewallRules);
app.get('/disk_encryption', diskEncryption);
app.get('/open_ports', openPorts);
app.get('/check_antivirus', checkAntivirus);
app.get('/firewall_status', firewallStatus);
app.get('/risky_processes', riskyProcesses);
app.get('/high_resource_usage', highResourceUsage);
app.get('/latest_updates', latestUpdates);
app.get('/adblock_status', adblockStatus);
app.get('/incognito_cookies', incognitoCookies);
app.get('/request_limit', requestLimit);
app.get('/third_party_cookies', thirdPartyCookies);
app.get('/malicious_phishing_site', maliciousPhishingSite);
app.get('/user_account_mgmt', userAccountMgmt);
app.get('/safe_browsing', safeBrowsing);

export default app;