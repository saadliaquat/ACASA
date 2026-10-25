import React, { useState, useEffect } from "react";

const RiskyProcessesAnalysis = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/tech/risky_processes")
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
      <h1>Risky Processes Analysis</h1>
      {data.riskyProcesses && data.riskyProcesses.length > 0 ? (
        <ul>
          {data.riskyProcesses.map((process, index) => (
            <li key={index}>
              {process.name} (PID: {process.pid})
            </li>
          ))}
        </ul>
      ) : (
        <p>No risky processes detected.</p>
      )}
    </div>
  );
};

export default RiskyProcessesAnalysis;
