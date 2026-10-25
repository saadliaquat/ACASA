import { execFile } from 'child_process';
import Document from '../models/Document.js';

export const employeeContract = async (req, res) => {
  const control_id = 2;
  try {
    const document = await Document.findOne({ controlId: control_id }).sort({ createdAt: -1 });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const filePath = document.filePath;
    console.log("Script running");
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
};

export const aftertermContract = async (req, res) => {
  const control_id = 5;
  try {
    const document = await Document.findOne({ controlId: control_id }).sort({ createdAt: -1 });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const filePath = document.filePath;
    console.log("Script running");
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
};

export const ndaContract = async (req, res) => {
  const control_id = 6;
  try {
    const document = await Document.findOne({ controlId: control_id }).sort({ createdAt: -1 });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const filePath = document.filePath;
    console.log("Script running");
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
};