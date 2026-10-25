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


// app.post("/generatewordISMS", async (req, res) => {
//   try {
//     console.log(req.body)
//     const formData = req.body;
//     console.log(formData)

//     // Generate the Word document asynchronously
//     const docBuffer = await generateWordDocumentISMS(formData);

//     // Set the response headers for file download
//     res.setHeader('Content-Disposition', 'attachment; filename=generated_document.docx');
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

//     // Send the generated document buffer as the response
//     res.send(docBuffer);
//   } catch (error) {
//     console.error('Error generating document:', error);
//     res.status(500).send('An error occurred while generating the document.');
//   }
// });

// // Generate the Word document asynchronously
// async function generateWordDocumentISMS(formData) {
//   return new Promise((resolve, reject) => {
//     // Load Word template file
//     const templateFile = fs.readFileSync(path.join(__dirname, './policies/ISMS_template.docx'), 'binary');
//     const zip = new PizZip(templateFile);

//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true
//     });

//     // const replacements = {
//     //   companyName: formData.companyName,
//     //   companyServices: formData.companyServices,
//     //   locations: formData.locations.join(", "),
//     //   assets: formData.assets.join(", "),
//     //   departments: formData.departments.join(", "),
//     //   predefinedObjectives: formData.predefinedObjectives.map(obj => {
//     //     return `Action Plan: ${obj.actionPlan}, Effectiveness Measures: ${obj.effectivenessMeasures}, Resources: ${obj.resources}, ETA: ${obj.eta}`;
//     //   }).join("\n"),
//     //   objectives: formData.objectives.map(obj => {
//     //     return `Name: ${obj.name}, Action Plan: ${obj.actionPlan}, Effectiveness Measures: ${obj.effectivenessMeasures}, Resources: ${obj.resources}, ETA: ${obj.eta}`;
//     //   }).join("\n"),
//     //   ismsowner: formData.ismsowner,
//     //   ismstype: formData.ismstype,
//     //   chairname: formData.chairname,
//     //   chairposition: formData.chairposition,
//     //   internalIssues: formData.internalIssues.join(", "),
//     //   externalIssues: formData.externalIssues.join(", "),
//     //   relevantRequirements: formData.relevantRequirements.map(req => {
//     //     return `Regulation: ${req.regulation}, Contractual: ${req.contractual}, Circumstances: ${req.circumstances}, Contact: ${req.contact}`;
//     //   }).join("\n"),
//     //   riskReasons: formData.riskReasons.join(", "),
//     //   IsmsCommunication: formData.IsmsCommunication.map(comm => {
//     //     return `Type: ${comm.type}, Recipients: ${comm.recipients}, Owner: ${comm.owner}, Frequency: ${comm.frequency}, Method: ${comm.method}, Approval Required: ${comm.approvalRequired}`;
//     //   }).join("\n"),
//     //   IsmsDocuments: formData.IsmsDocuments.map(doc => {
//     //     return `Document Name: ${doc.documentName}, Storage Location: ${doc.storageLocation}, Ownership: ${doc.ownership}`;
//     //   }).join("\n")
//     // };
//     const replacements = {
//       companyName: formData.companyName || '',
//       companyServices: formData.companyServices || '',
//       locations: Array.isArray(formData.locations) ? formData.locations.join(", ") : '',
//       assets: Array.isArray(formData.assets) ? formData.assets.join(", ") : '',
//       departments: Array.isArray(formData.departments) ? formData.departments.join(", ") : '',
//       predefinedObjectives: formData.predefinedObjectives || [],
//       objectives: formData.objectives || [],
//       ismsowner: formData.ismsowner || '',
//       ismsDetails: formData.ismsDetails || {},
//       internalIssues: Array.isArray(formData.internalIssues) ? formData.internalIssues.join(", ") : '',
//       externalIssues: Array.isArray(formData.externalIssues) ? formData.externalIssues.join(", ") : '',
//       relevantRequirements: formData.relevantRequirements || [],
//       riskReasons: formData.riskReasons || [],
//       IsmsCommunication: formData.IsmsCommunication || [],
//       IsmsDocuments: formData.IsmsDocuments || [],
//     };

//     let policyDocument = `
// Purpose  
// The purpose of this policy is to establish an Information Security Management System (ISMS) at ${replacements.companyName}. ${replacements.companyName} has established an Information Security Management System (“ISMS”) in accordance with ISO/IEC 27001 (“ISO 27001”) that governs the processes required to protect company and information assets. This document specifies the scope of the ISMS and PIMS at ${replacements.companyName}. 

// Policy Scope  
// The policy applies to all company software and hardware infrastructure, devices, systems, and data, covers all company products and services, and must be adhered to by all employees and contractors.  

// Ownership  
// ${replacements.ismsowner} is responsible for implementing and maintaining this policy.  

// Policy Objective  
// The objective of ${replacements.companyName} Executive Management is to continually strengthen and improve the overall capabilities of the ISMS, to increase professional skills in terms of information security management and technology, to make the ${replacements.companyName} management system so complete that reliable certification standards are effective, to ensure information-related business operations continue to be carried out to meet certification standards and to establish a sustainable operation plan for business that is cost-effective, and to establish quantified information security goals through annual management and review meetings. The objective highlights the following:  
// ● Information is only accessible to authorized persons.  
// ● Confidentiality of information is maintained.  
// ● Integrity of information is maintained throughout the process.  
// ● Business continuity plans are established, maintained, and tested.  
// ● All personnel are trained on information security and are informed that compliance with the policy is mandatory.  
// ● All breaches of information security and suspected weaknesses are reported and investigated.  
// ● Procedures exist to support the policy, including virus control measures, passwords, and continuity plans.  
// ● Business requirements for availability of information and systems will be met.  
// ● The ${replacements.companyName} is responsible for maintaining the policy and providing support and advice during its implementation.  
// ● All ${replacements.companyName}'s managers are directly responsible for implementing the policy and ensuring staff compliance in their respective departments.

// Scope of the ISMS  
// The scope of the ISO 27001 certification is limited to the Information Security Management System (ISMS) supporting the assets, technologies, and processes employed by ${replacements.companyName} located/housed at ${replacements.locations} for ${replacements.companyServices} services to its customers.  
// The scope of information includes the protection of the confidentiality, integrity, and availability of information.  
// The framework for managing information security in this policy applies to all employees within ${replacements.companyName}, workers, and other involved persons and all involved systems as defined in Information Security Policy.  
// This policy and all standards apply to all protected health information and other classes of protected information in any form as defined below in Data Classification. 

// Assets  
// The assets of the ISMS are further categorized as information, application, database, cloud services, and personnel:  
// ● ${replacements.assets}

// Locations  
// ● ${replacements.locations}

// Departments  
// The following departments are in-scope for the ISMS:  
// ● ${replacements.departments}

// Personnel  
// All personnel belonging to the above departments are in-scope for the ISMS.

// Scope Exclusions and Boundaries  
// ● ${replacements.companyName} uses Amazon Web Services (“AWS”) for cloud computing and storage services. Amazon is responsible for managing logical access to the underlying network, system management, and storage devices for its cloud service hosting ${replacements.companyName} data.  
// ● Amazon is responsible for the physical security and environmental controls at data center facilities hosting ${replacements.companyName} systems; therefore, physical security and environmental controls are out of scope for those facilities.  
// ● Amazon is responsible for the secure deletion of data and disposal of equipment used to support ${replacements.companyName} customer operations.  
// ● ${replacements.companyName} information, application, database, facility, and personnel assets that are not related to the identified in-scope components are out of scope for the ISMS.

// Information Security objectives  
// Information security objectives are set and monitored annually by ${replacements.companyName}'s ISMS Committee based upon a clear understanding of business requirements. The current information security objectives are as follows:  
// ● Protect the confidentiality, availability, and integrity of company, customer, and employee data  
// ● Comply with applicable laws, regulations, and customer contractual obligations  
// ● Achieve and maintain ISO 27001 and ISO 27701 certifications  
// ● Others

// The Action plans to achieve these objectives are maintained and reviewed annually by the ISMS Committee.  

// ${replacements.predefinedObjectives}
// ${replacements.objectives}

// Leadership and Commitment  
// ${replacements.companyName} is dedicated to establishing, implementing, maintaining, and continually improving the ISMS. Leadership commitment is demonstrated by the ISMS Committee when carrying out their responsibilities as defined in section ISMS Roles, Responsibilities, and Authorities.

// ISMS Roles, Responsibilities and Authorities  
// Involvement from top management is a critical component to the design and effectiveness of ${replacements.companyName}'s ISMS. Specifically, ${replacements.companyName} has defined the following management roles and responsibilities:  
// ● The Board of Directors is responsible for oversight of internal controls.  
// ● The ISMS Committee is chaired by [Title] and comprises [titles, title]. The council is in place to support information security or drive the future vision of information security.  
// ● Senior management is responsible for making strategic decisions within the organization, and ensuring that the organization's business strategy is aligned with its strategic objectives.  
// ● Managers are responsible for effective management of resources towards accomplishing the security goals.  
// ● Employees are responsible for implementing good security practices.

// Interested Parties of the ISMS  
// ${replacements.companyName} defines an interested party as someone, a group, or an entity with an interest in the ISMS. These can include staff, suppliers, customers, data subjects, shareholders, directors, prospects, board members, competitors, legislators and regulators, unions, media etc. Other stakeholders might include hackers and related malicious parties with interests in leveraging weakness in the ISMS program.  
// These interested parties' needs will be considered in more detail as part of the risk assessment process.

// Stakeholders 	Impact	Needs / expectation 	Legal obligations y/n?	Actions Required  
// Staff	Medium	Clear instructions on security, handling of data. 	Yes	Training program; Available Policies  
// Customers	Medium	Available service; Data is secured	Yes	Master Services Agreement Monitoring; Monitoring on Secure practices  
// Vendors	Medium	Achievable contractual agreements	Yes	Master Services Agreement Monitoring; Monitoring on Secure practices  
// Investors	High	Expect confidence with the organization ISMS program 	Yes	Monitoring on Secure practices, Third-party Assessment Audits  
// Prospects customers	Medium	Expects assurance of the state of the organization's data security.	No	Monitoring on Secure practices, Third-party Assessment Audits  
// Senior Management	High	Expect that industry best practices certifications are maintained to provide assurance to the board.	No	Monitoring on Secure practices, Third-party Assessment Audits  
// Board Members	High	Expect confidence with the organization ISMS program and continual monitoring	No	Monitoring on Secure practices, Third-party Assessment Audits  
// Regulators	High	Proportionate level of security controls at all times to protect assets. Notification on potential breaches	Yes	Third-party Assessment Audits, continual Improvement  
// Media	High	Transparency regarding security incidents	No	System status page, Security Incident Response plan  
// Hackers	High	Interested in weak security practices	No	Penetration testing, vulnerability scanning, Third-party Assessment Audits


// nternal and External Issues
// There are a number of internal and external issues that are relevant to the purpose of {companyName} and that affects the ability of the ISMS to achieve its intended outcome(s).

// Internal issues
// With regard to the {companyName} business itself, there are a number of relevant internal issues. 
// These include:
// ${replacements.internalIssues}
// These general internal issues will be considered in more detail as part of the risk assessment process.

// External issues
// With regard to the external environment in which {companyName} operates, there are a number of relevant external issues. 
// These include:
// ${replacements.externalIssues}
// These general external issues will be considered in more detail as part of the risk assessment process.

// Relevant Laws, Regulations, and Contractual Requirements
// ${replacements.companyName} identifies, updates, and maintains a current list of all applicable laws and regulatory authorities including relevant contacts to keep up to date with legislations that may affect the achievement of business objectives.

// Risk Assessment and Risk Treatment
// ${replacements.companyName} has defined a Risk Assessment and Risk Treatment Process for identifying, analyzing, treating, and monitoring risks over time.

// Performing Risk Assessments
// A Risk Assessment will be performed at least  or may be carried out under the following circumstances with varying scopes as determined by the {Title}. Additionally, risks may be assessed at various levels of the organization for circumstances that include:
// ● As part of projects that involve significant change to the organization, the ISMS, or the organization's assets
// ● Software development and changes
// ● When third-party suppliers are engaged, changed, or periodically during the relationship
// ● On major external change affecting the organization which may invalidate the conclusions from previous Risk Assessments, e.g., changes to relevant legislation
// ${replacements.riskReasons}


// `

//     console.log(policyDocument);



//     // Set the data in the document
//     doc.setData(replacements);

//     // Compile the document
//     try {
//       doc.render();
//       const output = doc.getZip().generate({ type: 'nodebuffer' });
//       resolve(output);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

app.listen(8000, () => console.log('Server running on http://localhost:8000'));