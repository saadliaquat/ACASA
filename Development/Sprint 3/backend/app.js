import express from "express";
import cors from "cors";
// Import MongoDB models
import Document from './models/Document.js'; 
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from "dotenv";
import fs from 'fs';
config(); // Load environment variables from .env file
// import express from "express";
// import cors from "cors";
// Import MongoDB models
// import Document from './models/Document.js'; 
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

import { exec } from "child_process";
import PDFDocument from "pdfkit";
import { ObjectId } from "mongodb";




// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Import routes
import UserRoutes from './routes/User_routes.js';
import ContractScriptRoutes from './routes/contract_scripts_routes.js';
import PolicyGenerationRoutes from './routes/policy_generation_routes.js';
import TechControlRoutes from './routes/tech_control_routes.js';

export const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', UserRoutes);
app.use('/contract', ContractScriptRoutes);
app.use('/policy', PolicyGenerationRoutes);
app.use('/tech', TechControlRoutes);

// Add multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const desktopPath = path.join(process.env.USERPROFILE, 'Documents', 'LUMS Study Resources', 'SPROJ', 'ACASA', 'P07-ACASA', 'files');
    cb(null, desktopPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define routes

app.post('/upload', upload.single('document'), async (req, res) => {
  const { controlId } = req.body; // Control ID passed with the file
  const filePath = req.file.path;
  const fileName = req.file.filename;

  try {
    const newDocument = new Document({ controlId, fileName, filePath });
    await newDocument.save();
    res.status(200).json({
      message: 'File uploaded and processed successfully!',
      document: newDocument,
    });
  } catch (err) {
    console.error('Error uploading file', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const runPythonScript = (scriptPath) => {
  return new Promise((resolve, reject) => { //promise as async so doesnt block other action while we get result from scrpt running. promise wraps the async function
    exec(`/usr/local/bin/python3 ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${scriptPath}:`, error.message);
        return reject(new Error(`Failed to execute ${scriptPath}: ${error.message}`));
      }
      if (stderr) {
        console.warn(`Warning in ${scriptPath}:`, stderr);
      }

      try {
        const data = JSON.parse(stdout);
        if (!data || typeof data !== "object") {
          throw new Error(`Invalid JSON output from ${scriptPath}`);
        }
        resolve(data);
      } catch (parseError) {
        console.error(`JSON Parse Error in ${scriptPath}:`, parseError.message);
        reject(new Error(`Invalid JSON response from ${scriptPath}`));
      }
    });
  });
};

function getControlName(controlId) {
  const controlNames = {
    "8.23": "Web Filtering",
    "8.7": "Protection Against Malware",
    "8.1": "end point devices",
    "8.2": "previledged access"
  };
  return controlNames[controlId] || `Control ${controlId}`;
}

// Route to generate the security report PDF
app.get("/generate-pdf/:controlId", async (req, res) => {
  try {
    const controlId = req.params.controlId;
    const bucket = req.app.locals.bucket; 
    let reportData = [];
    let scriptMapping = {};

    //err handling case: bucket not initialized 
    if (!bucket) {
      return res.status(500).json({ error: "GridFS bucket not initialized" });
    }

    if (controlId === "8.23") {
      scriptMapping = {
        "ad-block": "scripts/adblocker_check.py",
        "incognito-check": "scripts/incognito_privacy.py",
        "malicious-phishing": "scripts/malicious_site_check.py",
        "request-limit": "scripts/test_request_limit.py",
        "safe-browsing": "scripts/safe_browsing.py",
        "third-party-cookies": "scripts/test_third_party_cookies.py",
      };
    } else if (controlId === "8.7") {
      scriptMapping = {
        "firewall-config": "scripts/firewall_check.py",
        "firewall-status": "scripts/firewall_status.py",
        "antivirus-check": "scripts/antivirus_check.py",
      };
    } else if (controlId === "8.1"){
      scriptMapping = {
      
          "disk-encryption": "scripts/disk_encryption.py",
          "open-ports": "scripts/open_ports.py",
          "risky-processes": "scripts/risky_processes.py",
          "high-resource-usage": "scripts/high_resource_usage.py",
          "latest-updates": "scripts/latest_updates.py",
        
      };
    }
    else if (controlId === "8.2"){
      scriptMapping = {
        "user-account-mgmt": "scripts/user_account_mgmt.py"
      };
    }
    else {
      return res.status(400).json({ error: "Invalid control ID" });
    }

    console.log(`\nGenerating report for Control ${controlId}...`);
    
    for (const [control, scriptPath] of Object.entries(scriptMapping)) {
      try {
        console.log(`\n Running: ${scriptPath}`);
        const data = await runPythonScript(scriptPath);
        console.log(`Success: ${scriptPath}`, data);

        // extracting info 
        let formattedEntry = {
          control: control.replace(/-/g, " "), // format control names
          status: "PASS",
          details: JSON.stringify(data, null, 2), // convert JSON to string for PDF
        };

        // case of explicit failure message
        if (data.message && data.message.includes("❌")) {
          formattedEntry.status = "FAIL";
        }

        reportData.push(formattedEntry);
      } catch (error) {
        console.error(`❌ Script Error (${scriptPath}): ${error.message}`);
        reportData.push({ control, status: "ERROR", details: error.message });
      }
    }

    console.log("\n Generating PDF...");
    const pdfFileName = `Security-Report-Control-${controlId}.pdf`; 
    const pdfPath = path.join(__dirname, `Security-Report-Control-${controlId}.pdf`);
    generatePDF(reportData, pdfPath, controlId, getControlName(controlId), async () => {
      console.log(`PDF Generated: ${pdfPath}`);

      // Store PDF in MongoDB GridFS
      const uploadStream = bucket.openUploadStream(pdfFileName);
      fs.createReadStream(pdfPath).pipe(uploadStream);

      uploadStream.on("finish", () => {
        console.log(" PDF stored in MongoDB:", uploadStream.id);

        res.json({
          success: true,
          localPath: `/download-local/${controlId}`,
          dbPath: `/download-db/${uploadStream.id}`,
        });
      });

      uploadStream.on("error", (err) => {
        console.error(" GridFS Upload Error:", err);
        res.status(500).json({ error: "Failed to store PDF in database" });
      });
    });

  } catch (error) {
    console.error(" PDF Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// function to generate PDF from collected data
function generatePDF(reportData, filePath, controlId, controlName, callback) {

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);


  doc.fontSize(18).text(`Security Report for Control ${controlId} - ${controlName}`, { align: "center" });
  doc.moveDown();

  reportData.forEach((entry, index) => {
    doc.fontSize(16).text(`${index + 1}. ${entry.control}`, { underline: true });
    doc.moveDown();

    // Handle Error Status
    if (entry.status === "ERROR") {
      doc.fontSize(12).fillColor("red").text(`Status: ERROR`);
      doc.text(`Error Details: ${entry.details}`);
    } else {
      doc.fontSize(12).fillColor(entry.status === "FAIL" ? "red" : "green").text(`Status: ${entry.status}`);
      doc.moveDown().fillColor("black");

      // Handle Nested Details Properly
      if (entry.details && typeof entry.details === "object") {
        Object.keys(entry.details).forEach((key) => {
          const detail = entry.details[key];
          doc.fontSize(10).text(`${key}:`, { indent: 20 });

          if (typeof detail === "object") {
            Object.keys(detail).forEach((subKey) => {
              doc.fontSize(10).text(`- ${subKey}: ${detail[subKey]}`, { indent: 40 });
            });
          } else {
            doc.fontSize(10).text(`  ${detail}`, { indent: 40 });
          }
        });
      } else {
        doc.fontSize(10).text(`Details: ${entry.details}`, { indent: 20 });
      }
    }

    doc.moveDown().fillColor("black");
    doc.text("------------------------------------------------------");
    doc.moveDown();
  });

  doc.end();
  writeStream.on("finish", callback);
}



// API to serve PDF for Download
app.get("/download-pdf/:controlId", (req, res) => {
  const controlId = req.params.controlId;
  const pdfPath = path.join(__dirname, `Security-Report-Control-${controlId}.pdf`);

  res.download(pdfPath, `Security_Report_Control_${controlId}.pdf`, (err) => {
    if (err) {
      res.status(500).json({ error: "Error downloading the report" });
    }
  });
});

app.get("/download-db/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const bucket = req.app.locals.bucket;

    const downloadStream = bucket.openDownloadStream(fileId);
    res.setHeader("Content-Disposition", `attachment; filename="Security-Report.pdf"`);
    res.setHeader("Content-Type", "application/pdf");

    downloadStream.pipe(res);
  } catch (error) {
    console.error(" GridFS Download Error:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

app.get("/latest-report/:controlId", async (req, res) => {
  try {
    const { controlId } = req.params;
    const bucket = req.app.locals.bucket;

    if (!bucket) {
      return res.status(500).json({ error: "GridFS bucket not initialized" });
    }

    const latestFile = await bucket
      .find({ filename: new RegExp(`Security-Report-Control-${controlId}`, "i") })
      .sort({ uploadDate: -1 }) // sort by most recent upload
      .limit(1)
      .toArray();

    if (!latestFile.length) {
      return res.status(404).json({ error: "No reports found for this control" });
    }

    const fileId = latestFile[0]._id;
    console.log(`📄 Serving latest report: ${latestFile[0].filename}`);

    // retrieve file from GridFS and send it
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${latestFile[0].filename}"`);

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    downloadStream.pipe(res);
  } catch (error) {
    console.error(" Error retrieving latest report:", error);
    res.status(500).json({ error: "Failed to retrieve latest report" });
  }
});

