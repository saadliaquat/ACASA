const express = require('express');
const pool = require('./db');  // import the pool from db.js
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const { exec } = require('child_process');
const { stdout, stderr } = require('process');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Priveledged = require('./models/PriveledgedAcess');
const Malware = require('./models/Malware');
const ISMS = require('./models/ISMS');

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // allow frontend to access the API
  methods: ["GET", "POST"]
}));

// setting up multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const desktopPath = path.join('C:', 'Users', 'saadl', 'Desktop', 'uploads')
    cb(null, desktopPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//setup mongodb connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

app.get("/", (req, res) => {
  res.json({ message: "Hello, CORS is working!" });
});

// register Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // retrieve user by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (user && user.password === password) {
      res.json({ message: 'Login successful', user: user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// endpoint for file upload
app.post('/upload', upload.single('document'), async (req, res) => {
  const { controlId } = req.body; // Control ID passed with the file
  const filePath = req.file.path;
  const fileName = req.file.filename;

  try {
    // insert document information into the database
    const result = await pool.query(
      'INSERT INTO documents (control_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING *',
      [controlId, fileName, filePath]
    );

    res.status(200).json({
      message: 'File uploaded and processed successfully!',
      document: result.rows[0],
    });


  } catch (err) {
    console.error('Error uploading file', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/employee_contract', async (req, res) => {
  const control_id = 2;
  try {
    // fetch document information from the database
    const result = await pool.query(
      "SELECT * FROM documents WHERE control_id = $1",
      [control_id],
    );

    //fetch latest row according to timestamp
    let row = result.rows[result.rows.length - 1]
    let filePath = row.file_path

    console.log("Script running")
    execFile('python', ['./scripts/employee_contracts.py', filePath], (error, stdout, stderr) => {
      if (error) {
        console.error('Error calling Python script:', error);
        return res.status(500).json({ message: 'Error processing file in Python' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ message: 'Error in Python script execution' });
      }

      console.log('Python script output:', stdout);

      res.status(200).json({
        message: 'Employee contract file processed',
        pythonOutput: stdout
      });
    });

  } catch (err) {
    console.error('Error executing script', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/afterterm_contract', async (req, res) => {
  const control_id = 5;
  try {
    // fetch document information from the database
    const result = await pool.query(
      "SELECT * FROM documents WHERE control_id = $1",
      [control_id],
    );

    //fetch latest row according to timestamp
    let row = result.rows[result.rows.length - 1]
    let filePath = row.file_path

    console.log("Script running")
    execFile('python', ['./scripts/afterterm_contracts.py', filePath], (error, stdout, stderr) => {
      if (error) {
        console.error('Error calling Python script:', error);
        return res.status(500).json({ message: 'Error processing file in Python' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ message: 'Error in Python script execution' });
      }

      console.log('Python script output:', stdout);

      res.status(200).json({
        message: 'Employee after term contract file processed',
        pythonOutput: stdout
      });
    });

  } catch (err) {
    console.error('Error executing script', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/nda_contract', async (req, res) => {

  const control_id = 6;
  try {
    // fetch document information into the database
    const result = await pool.query(
      "SELECT * FROM documents WHERE control_id = $1",
      [control_id],
    );

    //fetch latest row according to timestamp
    let row = result.rows[result.rows.length - 1]
    let filePath = row.file_path

    console.log("Script running")
    execFile('python', ['./scripts/NDA_contracts.py', filePath], (error, stdout, stderr) => {
      if (error) {
        console.error('Error calling Python script:', error);
        return res.status(500).json({ message: 'Error processing file in Python' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ message: 'Error in Python script execution' });
      }

      console.log('Python script output:', stdout);

      res.status(200).json({
        message: 'Employee contract file processed',
        pythonOutput: stdout
      });
    });

  } catch (err) {
    console.error('Error uploading file', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/firewall-rules", (req, res) => {
  // Execute the Python script
  //NOTE IMP: the message will say loading until u enter desktop password in the terminal(backend). in temp frontend for testing, please modify in accordance to web structure
  execFile('python3', ['./scripts/firewall_check.py'], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});


app.get("/firewall-status", (req, res) => {
  // Execute the Python script
  execFile("python3", ["./scripts/firewall_status.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/check-antivirus", (req, res) => {
  // Execute the Python script
  execFile("python3", ["./scripts/antivirus_check.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});


app.get("/disk-encryption", (req, res) => {
  // Execute the Python script for Disk Encryption Check
  execFile("python3", ["./scripts/disk_encryption.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/open-ports", (req, res) => {
  // Execute the Python script for Open Ports Check
  execFile("python3", ["./scripts/open_ports.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/risky-processes", (req, res) => {
  // Execute the Python script for Risky Processes Check
  execFile("python3", ["./scripts/risky_processes.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/high-resource-usage", (req, res) => {
  // Execute the Python script for High Resource Usage Check
  execFile("python3", ["./scripts/high_resource_usage.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/latest-updates", (req, res) => {
  // Execute the Python script for Latest Updates Check
  execFile("python3", ["./scripts/latest_updates.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

//receice form data and generate Malware Policy document
app.post('/generateMalware', async (req, res) => {

  const formData = req.body;
  const { organizationName, cybersecurityFunction, headOfCybersecurity, durationOfReview } = formData;

  try {
    const policy = await Malware.find();

    if (policy.length === 0) {
      // Create a new policy if none exists
      const newPolicy = new Malware({
        organizationName,
        cybersecurityFunction,
        headOfCybersecurity,
        durationOfReview
      });

      await newPolicy.save();
      res.status(201).json({ message: "Saved successfully!" });
    } else {
      // Update existing policy
      const updatedPolicy = await Malware.findByIdAndUpdate(
        policy[0]._id,
        { organizationName, cybersecurityFunction, headOfCybersecurity, durationOfReview },
        { new: true }
      );
      await updatedPolicy.save();

      // res.status(201).json({ message: "Updated successfully!" });
    }

    // Read the .docx template file
    const templatePath = path.join(__dirname, 'policies', 'Malware.docx');
    const content = fs.readFileSync(templatePath, 'binary');

    // Create a PizZip instance from the binary content
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    // Render the document with the updated data
    doc.render({
      organizationName: organizationName,
    });

    try {
      const buf = doc.getZip().generate({ type: 'nodebuffer' });

      // res.setHeader('Content-Disposition', 'attachment; filename="MalwarePolicy.docx"');
      // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');


      res.send(buf);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing the Word file" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
})

//Fetch Malware Policy for a user if it exists
app.get('/fetchMalware', async (req, res) => {
  try {
    const policy = await Malware.find();
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

//receice form data and generate Priveledged Access Policy document
app.post('/generatePrivilegedAccess', async (req, res) => {
  const formData = req.body;
  const { companyName } = formData;

  try {
    const policy = await Priveledged.find();
    if (policy.length == 0) {

      const newpolicy = new Priveledged({ companyName: companyName });
      await newpolicy.save();
      res.status(201).json({ message: "Saved successfully!" });
    }
    else {
      const updatedPolicy = await Priveledged.findByIdAndUpdate(policy[0]._id, { companyName: formData.companyName }, { new: true });
      await updatedPolicy.save();
      res.status(201).json({ message: "Updated successfully!" });
    }
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  const templatePath = path.join(__dirname, 'policies', 'Priveledged_Access.docx');
  const content = fs.readFileSync(templatePath, 'binary');

  // Create a PizZip instance from the binary content
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);


  doc.render({
    "Company X": companyName,
  });

  try {
    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    // res.setHeader('Content-Disposition', 'attachment; filename="PriveledgedAccessPolicy.docx"');
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');


    res.send(buf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing the Word file" });
  }
})

//Fetch Priveledged Access Policy for a user if it exists
app.get('/fetchPrivilegedAccess', async (req, res) => {
  try {
    const policy = await Priveledged.find();
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post('/generateISMS', async (req, res) => {
  const formData = req.body;
  const {
    companyName,
    companyServices,
    locations,
    assets,
    departments,
    objectives,
    ismsDetails,
    interestedParties,
    internalIssues,
    externalIssues,
    relevantRequirements,
    riskReasons,
    ismsCommunication,
    ismsDocuments,
  } = formData;

  try {
    let existingPolicy = await ISMS.findOne({ companyName: companyName });

    if (!existingPolicy) {
      const newPolicy = new ISMS({
        companyName,
        companyServices,
        locations,
        assets,
        departments,
        objectives,
        ismsDetails,
        interestedParties,
        internalIssues,
        externalIssues,
        relevantRequirements,
        riskReasons,
        ismsCommunication,
        ismsDocuments,
      });

      await newPolicy.save();
      res.status(201).json({ message: 'Saved successfully!' });
    } else {
      existingPolicy.services = companyServices;
      existingPolicy.locations = locations;
      existingPolicy.assets = assets;
      existingPolicy.departments = departments;
      existingPolicy.objectives = objectives;
      existingPolicy.ismsDetails = ismsDetails;
      existingPolicy.interestedParties = interestedParties;
      existingPolicy.internalIssues = internalIssues;
      existingPolicy.externalIssues = externalIssues;
      existingPolicy.relevantRequirements = relevantRequirements;
      existingPolicy.riskReasons = riskReasons;
      existingPolicy.ismsCommunication = ismsCommunication;
      existingPolicy.ismsDocuments = ismsDocuments;
      await existingPolicy.save();
      res.status(200).json({ message: 'Updated successfully!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.get('/fetchISMS', async (req, res) => {
  try {
    const policy = await ISMS.find();
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})



app.get("/safe-browsing", (req, res) => {
  // Execute the Safe Browsing Python script
  execFile("/usr/local/bin/python3", ["./scripts/safe_browsing.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/adblock-status", (req, res) => {
  // Execute the Adblock Python script
  execFile("/usr/local/bin/python3", ["./scripts/adblocker_check.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/incognito-cookies", (req, res) => {
  // Execute the Incognito Cookies Python script
  execFile("/usr/local/bin/python3", ["./scripts/incognito_privacy.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/request-limit", (req, res) => {
  // Execute the Request Limit Python script
  execFile("/usr/local/bin/python3", ["./scripts/test_request_limit.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/third-party-cookies", (req, res) => {
  // Execute the Third-party Cookies Python script
  execFile("/usr/local/bin/python3", ["./scripts/test_third_party_cookies.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/malicious_phishing_site", (req, res) => {

  execFile("/usr/local/bin/python3", ["./scripts/malicious_site_check.py"], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message,
      });
    }

    try {
      // Parse the Python script's output as JSON
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse Python script output.",
      });
    }
  });
});

app.get("/user-account-mgmt", (req, res) => {
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
      // Parse the Python script's output
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
});


app.listen(8000, () => console.log('Server running on http://localhost:8000'));