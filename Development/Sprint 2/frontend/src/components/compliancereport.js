import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Design/dashboard.css'

function GenerateComplianceReport() {
  const location = useLocation();

  // Parse the query parameters from the URL using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const completionPercentage = queryParams.get('completionPercentage');

  return (
    <div className="generate-report">
      <h2>Compliance Report</h2>
      <p>Completion Percentage of Document Boxes Checked: {completionPercentage}%</p>
    </div>
  );
}

export default GenerateComplianceReport;
