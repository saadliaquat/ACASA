import React, { useState, useEffect } from "react";

const LatestUpdatesAnalysis = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/tech/latest_updates")
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
      <h1>Latest Updates Analysis</h1>
      <p>{data.message || "Could not determine latest updates."}</p>
    </div>
  );
};

export default LatestUpdatesAnalysis;
