import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';


import Malware from '../models/Malware.js';
import Priveledged from '../models/PriveledgedAcess.js';
import ISMS from '../models/ISMS.js';


// Generate Malware policy
export const generateMalware = async (req, res) => {
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
            // Optionally send a response here if needed:
            // res.status(201).json({ message: "Updated successfully!" });
        }

        // Read the .docx template file
        const templatePath = path.join(__dirname, 'policies', 'Malware.docx');
        const content = fs.readFileSync(templatePath, 'binary');

        // Create a PizZip instance from the binary content
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);

        // Render the document with the updated data
        doc.render({ organizationName });

        try {
            const buf = doc.getZip().generate({ type: 'nodebuffer' });
            res.send(buf);
        } catch (error) {
            console.error("Error generating Word file:", error);
            res.status(500).json({ error: "Error processing the Word file" });
        }
    } catch (err) {
        console.error("Error in generateMalware:", err);
        res.status(500).json({ error: err.message });
    }
};


// Fetch Malware policy
export const fetchMalware = async (req, res) => {
    try {
        const policy = await Malware.find();
        res.json(policy);
    } catch (err) {
        console.error("Error fetching Malware policy:", err);
        res.status(500).json({ error: err.message });
    }
};

// Generate privileged access policy
export const generatePrivilegedAccess = async (req, res) => {
    const formData = req.body;
    const { companyName } = formData;

    try {
        const policy = await Priveledged.find();
        if (policy.length === 0) {
            const newPolicy = new Priveledged({ companyName });
            await newPolicy.save();
            res.status(201).json({ message: "Saved successfully!" });
        } else {
            const updatedPolicy = await Priveledged.findByIdAndUpdate(
                policy[0]._id,
                { companyName },
                { new: true }
            );
            await updatedPolicy.save();
            res.status(201).json({ message: "Updated successfully!" });
        }
    } catch (err) {
        console.error("Error in generatePrivilegedAccess (policy update):", err);
        res.status(500).json({ error: err.message });
    }

    // Generate the document from the template
    const templatePath = path.join(__dirname, 'policies', 'Priveledged_Access.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    // Note: The key used here ("Company X") should match your template's placeholder.
    doc.render({ "Company X": companyName });

    try {
        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        res.send(buf);
    } catch (error) {
        console.error("Error generating Privileged Access document:", error);
        res.status(500).json({ error: "Error processing the Word file" });
    }
};




//ISMS Policy Generation
export const generateISMS = async (req, res) => {
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
        ismsDocuments
    } = formData;

    try {
        let existingPolicy = await ISMS.findOne({ companyName });
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
                ismsDocuments
            });
            await newPolicy.save();
            res.status(201).json({ message: 'Saved successfully!' });
        } else {
            existingPolicy.services = companyServices;
            existingPolicy.locations = locations;
            // ... update other fields similarly
            await existingPolicy.save();
            res.status(200).json({ message: 'Updated successfully!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch ISMS policy
export const fetchISMS = async (req, res) => {
    try {
        const policy = await ISMS.find();
        res.json(policy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
