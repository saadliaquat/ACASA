import React, { useState, useEffect } from "react";

const AntivirusCheck = () => {
  const [antivirusData, setAntivirusData] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // fetch antivirus data from the backend
    fetch("http://localhost:8000/tech/check_antivirus")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAntivirusData(data);
        } else {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading antivirus status...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Error fetching antivirus data: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Antivirus Check</h1>
      {antivirusData ? (
        <>
          <p>
            Antivirus Installed:{" "}
            {antivirusData.antivirus_installed ? "Yes" : "No"}
          </p>
          <h2>Found Applications</h2>
          {antivirusData.found.length > 0 ? (
            <ul>
              {antivirusData.found.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          ) : (
            <p>No antivirus or security-related applications found.</p>
          )}
        </>
      ) : (
        <p>Could not retrieve antivirus information.</p>
      )}
    </div>
  );
};

export default AntivirusCheck;
