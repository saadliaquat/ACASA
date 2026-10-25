import { execFile } from 'child_process';

// Firewall Rules Check
export const firewallRules = (req, res) => {
  execFile('python3', ['./scripts/firewall_check.py'], (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing firewall_check.py:", error);
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (parseError) {
      console.error("Error parsing Python script output:", parseError);
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Disk Encryption Check
export const diskEncryption = (req, res) => {
  execFile("python3", ["./scripts/disk_encryption.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: stderr || error.message });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({ success: false, error: "Failed to parse Python script output." });
    }
  });
};

// Open Ports Check
export const openPorts = (req, res) => {
  execFile("python3", ["./scripts/open_ports.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: stderr || error.message });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({ success: false, error: "Failed to parse Python script output." });
    }
  });
};

// Check Antivirus
export const checkAntivirus = (req, res) => {
  execFile("python3", ["./scripts/antivirus_check.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Firewall Status Check
export const firewallStatus = (req, res) => {
  execFile("python3", ["./scripts/firewall_status.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Risky Processes Check
export const riskyProcesses = (req, res) => {
  execFile("python3", ["./scripts/risky_processes.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// High Resource Usage Check
export const highResourceUsage = (req, res) => {
  execFile("python3", ["./scripts/high_resource_usage.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Latest Updates Check
export const latestUpdates = (req, res) => {
  execFile("python3", ["./scripts/latest_updates.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Adblock Status Check
export const adblockStatus = (req, res) => {
  execFile("/usr/local/bin/python3", ["./scripts/adblocker_check.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Incognito Cookies Check
export const incognitoCookies = (req, res) => {
  execFile("/usr/local/bin/python3", ["./scripts/incognito_privacy.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Request Limit Check
export const requestLimit = (req, res) => {
  execFile("/usr/local/bin/python3", ["./scripts/test_request_limit.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Third-party Cookies Check
export const thirdPartyCookies = (req, res) => {
  execFile("/usr/local/bin/python3", ["./scripts/test_third_party_cookies.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// Malicious Phishing Site Check
export const maliciousPhishingSite = (req, res) => {
  execFile("/usr/local/bin/python3", ["./scripts/malicious_site_check.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};

// User Account Management Check
export const userAccountMgmt = (req, res) => {
  console.log("Script for User Account Management is running");
  execFile("python3", ["./scripts/user_account_mgmt.py"], (error, stdout, stderr) => {
    if (error) {
      console.error("Error calling Python script:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing the user account management script"
      });
    }
    if (stderr) {
      console.error("Python script stderr:", stderr);
      return res.status(500).json({
        success: false,
        message: "Python script execution error"
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.status(200).json({
        success: true,
        message: "User account management script executed successfully",
        result: data
      });
    } catch (parseError) {
      console.error("Error parsing Python script output:", parseError);
      res.status(500).json({
        success: false,
        message: "Failed to parse Python script output"
      });
    }
  });
};

// Safe Browsing Check
export const safeBrowsing = (req, res) => {
  execFile("/usr/local/bin/python3", ["./scripts/safe_browsing.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, ...data });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
};
