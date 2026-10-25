import React, { useState, useEffect } from "react";

const DiskEncryptionAnalysis = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/tech/disk_encryption")
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
      <h1>Disk Encryption Analysis</h1>
      <p>{data.message || "Disk encryption status could not be determined."}</p>
    </div>
  );
};

export default DiskEncryptionAnalysis;
