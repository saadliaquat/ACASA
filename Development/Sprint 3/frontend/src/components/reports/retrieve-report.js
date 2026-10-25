import React, { useState, useEffect, useCallback } from "react";

const LatestReportViewer = () => {
  const [controlId, setControlId] = useState("8.23");
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");

  // Memoized fetch function
  const fetchLatestReport = useCallback(async () => {
    try {
      setError("");
      setPdfUrl("");

      const response = await fetch(`http://localhost:8000/latest-report/${controlId}`);
      if (!response.ok) {
        throw new Error("No report available for this control.");
      }

      setPdfUrl(`http://localhost:8000/latest-report/${controlId}`);
    } catch (err) {
      setError(err.message);
    }
  }, [controlId]);

  // fetch latest report when controlId changes
  useEffect(() => {
    fetchLatestReport();
  }, [fetchLatestReport]); 

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">Latest Security Report</h2>

      <div className="flex items-center gap-4 mt-4">
        <input
          type="text"
          placeholder="Enter Control ID (e.g., 8.23)"
          value={controlId}
          onChange={(e) => setControlId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={fetchLatestReport}>
          Fetch Report
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {pdfUrl && (
        <div className="mt-4">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
        <button 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={() => window.open(pdfUrl, "_blank")}
        >
        Open Report in New Tab
        </button>
            </a>
        </div>
        )}

    </div>
  );
};

export default LatestReportViewer;
