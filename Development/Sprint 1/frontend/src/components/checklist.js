import React, { useState, useEffect } from 'react';
import '../Design/control.css';
import { useNavigate } from 'react-router-dom';

const Checklist = ({ handleCheck, handleDocumentUpload, setTotalControls, setCheckedCount }) => {
  const [policies, setPolicies] = useState([{ id: 1, name: "ISMS Scope Policy" },
  { id: 2, name: "Priveledged Access Management Policy" },
  { id: 3, name: "Malware Detection Policy" }])

  const [controls, setControls] = useState([
    { id: 1, controlId: "6.1", name: "Screening" },
    { id: 2, controlId: "6.2", name: "Terms and Conditions of Employment" },
    { id: 3, controlId: "6.3", name: "Information Security Awareness, Education and Training" },
    { id: 4, controlId: "6.4", name: "Disciplinary Process" },
    { id: 5, controlId: "6.5", name: "Responsibilities After Termination or Change of Employment" },
    { id: 6, controlId: "6.6", name: "Confidentiality or Non-Disclosure Agreements" },
    { id: 7, controlId: "6.7", name: "Remote Working" },
    { id: 8, controlId: "6.8", name: "Information Security Event Reporting" },
    { id: 9, controlId: "8.1", name: "User Endpoint Devices" },
    { id: 10, controlId: "8.2", name: "Privileged Access Rights" },
    { id: 11, controlId: "8.3", name: "Information Access Restriction" },
    { id: 12, controlId: "8.4", name: "Access to Source Code" },
    { id: 13, controlId: "8.5", name: "Secure Authentication" },
    { id: 14, controlId: "8.6", name: "Capacity Management" },
    { id: 15, controlId: "8.7", name: "Protection Against Malware" },
    { id: 16, controlId: "8.8", name: "Management of Technical Vulnerabilities" },
    { id: 17, controlId: "8.9", name: "Configuration Management" },
    { id: 18, controlId: "8.10", name: "Information Deletion" },
    { id: 19, controlId: "8.11", name: "Data Masking" },
    { id: 20, controlId: "8.12", name: "Data Leakage Prevention" },
    { id: 21, controlId: "8.13", name: "Information Backup" },
    { id: 22, controlId: "8.14", name: "Redundancy of Information Processing Facilities" },
    { id: 23, controlId: "8.15", name: "Logging" },
    { id: 24, controlId: "8.16", name: "Monitoring Activities" },
    { id: 25, controlId: "8.17", name: "Clock Synchronization" },
  ]);
  const [checkedCount, setCheckedCountState] = useState(0); // Track checked count
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalControl, setModalControl] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTotalControls(controls.length); // Set total controls in parent
  }, [controls, setTotalControls]);

  useEffect(() => {
    // Pass checked count to parent
    setCheckedCount(checkedCount);
  }, [checkedCount, setCheckedCount]);

  const handleCheckboxChange = (id) => {
    setControls((prevControls) =>
      prevControls.map((control) => {
        if (control.id === id) {
          const updatedControl = { ...control, isChecked: !control.isChecked };

          // Update checked count
          setCheckedCountState((prevCount) =>
            updatedControl.isChecked ? prevCount + 1 : prevCount - 1
          );
          return updatedControl;
        }
        return control;
      })
    );
  };

  const handlePolicyCheckboxChange = (id) => {
    setPolicies((prevPolicies) =>
      prevPolicies.map((policy) => {
        if (policy.id === id) {
          const updatedPolicies = { ...policy, isChecked: !policy.isChecked };

          // Update checked count
          // setCheckedCountState((prevCount) =>
          //   updatedControl.isChecked ? prevCount + 1 : prevCount - 1
          // );
          return updatedPolicies;
        }
        return policy;
      })
    );
  };

  const handleFileUpload = async (id, file) => {
    if (!file) {
      console.log(`No file selected for control ID: ${id}`);
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('controlId', id);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`File uploaded successfully for control ID ${id}:`, data);
        handleDocumentUpload(true, id); // Mark as uploaded
      } else {
        console.error(`File upload failed for control ID ${id}`);
      }
    } catch (err) {
      console.error(`Error uploading file for control ID ${id}:`, err);
    }
  };
  const toggleModal = () => {
    setModalOpen(!isModalOpen);

  };

  const RunEmployee = async () => {

    try {
      console.log("About to run")
      const response = await fetch('http://localhost:8000/employee_contract', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Script executed successfully`, data);
        if (data.pythonOutput === "Satisified") {
          handleCheckboxChange(2);
        }
      } else {
        console.error(`Script execution failed`);
      }
    }
    catch (err) {
      console.error(`Error executing script:`, err);
    }
  }

  const RunAfterTerm = async () => {

    try {
      console.log("About to run")
      const response = await fetch('http://localhost:8000/afterterm_contract', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Script executed successfully`, data);
        if (data.pythonOutput === "Satisified") {
          handleCheckboxChange(5);
        }
      } else {
        console.error(`Script execution failed`);
      }
    }
    catch (err) {
      console.error(`Error executing script:`, err);
    }
  }

  const RunNDA = async () => {

    try {
      console.log("About to run")
      const response = await fetch('http://localhost:8000/nda_contract', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Script executed successfully`, data);
        // if (data.pythonOutput === "Satisified")
        // {
        handleCheckboxChange(6);
        // }
      } else {
        console.error(`Script execution failed`);
      }
    }
    catch (err) {
      console.error(`Error executing script:`, err);
    }
  }


  return (
    <div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th>Policy ID</th>
            <th>Control Name</th>
            <th>Checkbox</th>
            <th>Upload Document</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id}>
              {policy.id === 1 && (
                <>
                  <td>
                    <a href={`/policy/ISMS`} className="no-underline">
                      {policy.id}
                    </a>
                  </td>
                  <td>
                    <a href={`/policy/ISMS`} className="no-underline">
                      {policy.name}
                    </a>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={policy.isChecked || false}
                      onChange={() => handlePolicyCheckboxChange(policy.id)}
                    />
                  </td>
                </>
              )}
              {/* <td>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    handleFileUpload(policy.id, file);
                  }}
                />
              </td> */}
              {/* <td> */}
              {/* {control.controlId === "8.7" && (
                  <button onClick={()=>{
                  toggleModal()
                  setModalControl(8.1)}} className="automate-btn">
                    Automate
                  </button>
                )}
                {control.controlId === "6.2" && (
                  <button onClick={RunEmployee} className="automate-btn">
                    Automate
                  </button>
                )}
                {control.controlId === "6.5" && (
                  <button onClick={RunAfterTerm} className="automate-btn">
                    Automate
                  </button>
                )}
                {control.controlId === "6.6" && (
                  <button onClick={RunNDA} className="automate-btn">
                    Automate
                  </button>
                )} */}
              {/* </td> */}
            </tr>
          ))}
        </tbody>
      </table>


      <p>Total Checked: {checkedCount}</p>
      <table className="checklist-table">
        <thead>
          <tr>
            <th>Control ID</th>
            <th>Control Name</th>
            <th>Checkbox</th>
            <th>Upload Document</th>
          </tr>
        </thead>
        <tbody>
          {controls.map((control) => (
            <tr key={control.id}>
              <td>{control.controlId}</td>
              <td>{control.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={control.isChecked || false}
                  onChange={() => handleCheckboxChange(control.id)}
                />
              </td>
              <td>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    handleFileUpload(control.id, file);
                  }}
                />
              </td>
              <td>
                {/* Add a button for 8.1 with popup */}
                {control.controlId === "8.1" && (
                  <button onClick={()=>{
                  toggleModal()
                  setModalControl(8.1)}} className="automate-btn">
                    Automate
                  </button>
                )}
                {control.controlId === "8.7" && (
                  <button onClick={()=>{
                  toggleModal()
                  setModalControl(8.7)}} className="automate-btn">
                    Automate
                  </button>
                )}
                {control.controlId === "6.2" && (
                  <button onClick={RunEmployee} className="automate-btn">
                    Automate
                  </button>
                )}
                {control.controlId === "6.5" && (
                  <button onClick={RunAfterTerm} className="automate-btn">
                    Automate
                  </button>
                )}
                {control.controlId === "6.6" && (
                  <button onClick={RunNDA} className="automate-btn">
                    Automate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* this is temp implementation with modal, please adjust flow according to design choice that u use for other controls ~rida */}
      {modalControl === 8.1 && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>Automate Actions for Control 8.1</h2>
            <p>Choose an action to automate for User Endpoint Devices:</p>
            <div className="modal-actions">
              <button
                onClick={() => (window.location.href = "/disk-encryption")}
                className="modal-btn"
              >
                Disk Encryption
              </button>
              <button
                onClick={() => (window.location.href = "/open-ports")}
                className="modal-btn"
              >
                Open Ports
              </button>
              <button
                onClick={() => (window.location.href = "/risky-processes")}
                className="modal-btn"
              >
                Risky Processes
              </button>
              <button
                onClick={() => (window.location.href = "/high-resource-usage")}
                className="modal-btn"
              >
                High Resource Usage
              </button>
              <button
                onClick={() => (window.location.href = "/latest-updates")}
                className="modal-btn"
              >
                Latest Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {modalControl === 8.7 && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>Automate Actions for Control 8.7</h2>
            <p>Choose an action to automate for Protection Against Malware:</p>
            <div className="modal-actions">
              <button
                onClick={() => (window.location.href = "/firewall-config")}
                className="modal-btn"
              >
                Firewall Configuration
              </button>
              <button
                onClick={() => (window.location.href = "/firewall-status")}
                className="modal-btn"
              >
                Firewall Status
              </button>
              <button
                onClick={() => (window.location.href = "/antivirus-check")}
                className="modal-btn"
              >
                Antivirus Check
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
