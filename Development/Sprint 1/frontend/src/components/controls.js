import React, { useState } from 'react';

const Control = ({ control, handleCheck }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    handleCheck(!isChecked);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('controlId', control.id);

      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('File uploaded successfully:', data);
        } else {
          console.error('File upload failed');
        }
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  };

  return (
    <div className="control-item">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={toggleCheckbox}
      />
      <span>{control.name}</span>
      <input
        type="file"
        onChange={handleFileUpload}
        className="file-upload"
      />
    </div>
  );
};

export default Control;
