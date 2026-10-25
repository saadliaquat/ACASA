import React, { useState, useEffect } from "react";

const OpenPortsAnalysis = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/open-ports")
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
      <h1>Open Ports Analysis</h1>
      {data.openPorts && data.openPorts.length > 0 ? (
        <ul>
          {data.openPorts.map((port, index) => (
            <li key={index}>Port: {port}</li>
          ))}
        </ul>
      ) : (
        <p>No open ports found.</p>
      )}
    </div>
  );
};

export default OpenPortsAnalysis;
