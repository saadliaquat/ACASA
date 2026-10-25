import React, { useState } from "react";
import { useEffect } from "react";

const PrivilegedAccessPolicy = () => {
    const [formData, setFormData] = useState({
        companyName: "",
    });

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [loaded, setloaded] = useState(false);

    const FetchPriveledged = async () => {
        const response = await fetch("http://localhost:8000/fetchPrivilegedAccess", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("data", data)
            if (data.length > 0) {
                setFormData(data[0]);
            } else {
                setFormData({
                    companyName: "",
                });
            }
        }

        setloaded(true);
    }


    // Function to send data to backend
    const GeneratePriveledgedAcessPolicy = async () => {
        try {
            const response = await fetch("http://localhost:8000/generatePrivilegedAccess", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Convert the response to binary data (Blob)
            const blob = await response.blob();

            // Create a temporary download link for the file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'PriveledgedAccess.docx';  // Set the download file name
            link.click();
            alert("Saved Successfully");
        } catch (err) {
            console.error('Error generating document:', err);
            // setError('An error occurred while generating the document.');
        }
    }

    useEffect(() => {
        FetchPriveledged();
    }, []);


    return (
        <>
            {loaded && (
                <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
                    <h2 className="text-xl font-bold mb-4">Company Details</h2>
                    <div className="p-4 border border-gray-300 rounded-md bg-gray-50 mb-6">
                        <label className="block mb-4">
                            <span className="font-medium">Company Name:</span>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </label>
                    </div>

                    <button
                        onClick={GeneratePriveledgedAcessPolicy}
                        disabled={!formData.companyName}
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 disabled:bg-gray-400"
                    >
                        Save
                    </button>
                </div>
            )}
        </>

    )
}


export default PrivilegedAccessPolicy;
