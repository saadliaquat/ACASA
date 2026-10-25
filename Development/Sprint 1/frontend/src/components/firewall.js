import React, { useState, useEffect } from "react";

const FirewallAnalysis = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/firewall-rules")
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
      <h1>Firewall Analysis</h1>
      <h2>Whitelist Rules</h2>
      {data.whitelistRules.length > 0 ? (
        <ul>
          {data.whitelistRules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      ) : (
        <p>No whitelist rules found.</p>
      )}

      <h2>Blocked Sites</h2>
      {data.blockedSites.length > 0 ? (
        <ul>
          {data.blockedSites.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      ) : (
        <p>No blocked sites found.</p>
      )}
    </div>
  );
};

export default FirewallAnalysis;
