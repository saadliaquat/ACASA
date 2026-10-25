import React, { useState } from "react";
import axios from "axios";

const FullReport = ({ controlId }) => {
  const [pdfReady, setPdfReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const generateFullReport = async () => {
    setLoading(true);
    setErrorMessage(null); // Reset error message before starting

    try {
      const response = await axios.get(`http://localhost:8000/generate-pdf/${controlId}`, {
        responseType: "blob", // Handle response as a file
      });

      if (response.status === 200) {
        setPdfReady(true);

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `compliance_report_${controlId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        alert(`✅ Report for Control ${controlId} generated successfully!`);
      } else {
        setErrorMessage(` Error generating report: ${response.statusText}`);
      }
    } catch (error) {
      console.error(` Report Generation Failed for Control ${controlId}:`, error);
      setErrorMessage(error.response?.data?.message || "Unknown error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-start gap-4 p-4 border rounded-lg shadow-lg bg-white">
      <button
        onClick={generateFullReport}
        disabled={loading}
        className={`px-5 py-2 font-semibold text-white rounded-md transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
            </svg>
            Generating Report...
          </span>
        ) : (
          `Generate Report for ${controlId}`
        )}
      </button>

      {errorMessage && (
        <div className="w-full px-4 py-2 text-sm text-red-800 bg-red-200 border border-red-400 rounded-md">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  );
};

export default FullReport;
