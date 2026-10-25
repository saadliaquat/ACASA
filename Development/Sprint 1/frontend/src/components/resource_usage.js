import React, { useState, useEffect } from "react";

const HighResourceUsageAnalysis = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/high-resource-usage")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setData(data);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>High Resource Usage Analysis</h1>
      {data.highResourceProcesses && data.highResourceProcesses.length > 0 ? (
        <ul>
          {data.highResourceProcesses.map((process, index) => (
            <li key={index}>
              {process.name} (PID: {process.pid}) - CPU: {process.cpu_percent}% - Memory:{" "}
              {process.memory_mb} MB
            </li>
          ))}
        </ul>
      ) : (
        <p>No processes exceeding resource thresholds.</p>
      )}
    </div>
  );
};

export default HighResourceUsageAnalysis;
