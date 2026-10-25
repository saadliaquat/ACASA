import React, { useState } from 'react';
import Checklist from './checklist';
import '../Design/dashboard.css'

const Dashboard = () => {
  const [totalControls, setTotalControls] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);

  // Function to calculate the completion percentage and generate the report
  const generateReport = () => {
    // Calculate the completion percentage
    const completionPercentage = Math.round((checkedCount / totalControls) * 100);

    // Log the report or do other things (e.g., save it as a file)
    console.log("Compliance Report:");
    console.log(`Total Controls: ${totalControls}`);
    console.log(`Checked Controls: ${checkedCount}`);
    console.log(`Completion Percentage: ${completionPercentage}%`);

    // Redirect to the report page (or handle report generation as needed)
    window.location.href = `/generate-report?completionPercentage=${completionPercentage}`;
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Pass down the state setters to the Checklist component */}
      <div>
        {/* Button to generate the report */}
        <button class = "generate-report-btn" onClick={generateReport}>Generate Compliance Report</button>
      </div>
      <Checklist
        setTotalControls={setTotalControls}
        setCheckedCount={setCheckedCount}
      />
      {/* Display checked count */}
      <p>Checked Controls: {checkedCount}</p>
    </div>
  );
};

export default Dashboard;
