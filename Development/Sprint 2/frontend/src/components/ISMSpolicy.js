import React, { useState } from "react";
import { useParams } from "react-router-dom";


const IsmsPolicy = () => {
    // const { policyId } = useParams();

    const [locations, setLocations] = useState([""]);
    const [assets, setAssets] = useState([""]);
    const [departments, setDepartments] = useState([""]);

    // const [predefinedObjectives, setPredefinedObjectives] = useState([
    //     { name: "Protect the confidentiality of customer data", actionPlan: "", effectivenessMeasures: "", resources: "", eta: "" },
    //     { name: "Comply with applicable laws, regulations, and customer contractual obligations" , actionPlan: "", effectivenessMeasures: "", resources: "", eta: "" },
    //     { name: "Achieve and maintain ISO 27001 and ISO 27701 certifications", actionPlan: "", effectivenessMeasures: "", resources: "", eta: "" },
    // ]);

    // const predefinedInternalIssues = [
    //     "Uncertainties in employee relations",
    //     "Significant organizational changes",
    //     "Location moves",
    //     "Company financial performance",
    //     "Company culture",
    //     "Resources and knowledge of the organization",
    //     "Governance and organizational structure",
    //     "Adopted standards and models",
    //     "Contractual relationships"
    // ];

    // const predefinedExternalIssues = [
    //     "Political",
    //     "Government policy changes",
    //     "Government instability",
    //     "Unrest in countries in which the organization operates",
    //     "Trade restrictions and tariffs",
    //     "Economic",
    //     "Prevailing economic climate",
    //     "Interest and inflation rates",
    //     "Supplier failure",
    //     "Lack of customer demand",
    //     "Increasing globalization of supply and/or demand",
    //     "Increasing competition",
    //     "Social",
    //     "Changing demographics",
    //     "Population growth changes",
    //     "Social attitudes",
    //     "Technology",
    //     "Pace of innovation",
    //     "Supporting technologies and infrastructure",
    //     "Automation and artificial intelligence",
    //     "Legal",
    //     "Potential legislative changes",
    //     "Regulatory changes",
    //     "Data protection",
    //     "Environmental",
    //     "Climate change",
    //     "Fire, flood, earthquake etc.",
    //     "Pollution"
    // ];

    const [objectives, setObjectives] = useState([ { name: "", actionPlan: "", effectivenessMeasures: "", resources: "", eta: "" }]);

    const [ismsDetails, setIsmsDetails] = useState({
        owner: "",
        type: "",
        chair: { name: "", position: "" },
        members: [{ name: "", position: "" }],
    });

    const [interestedParties, setInterestedParties] = useState([
        { stakeholder: "", impact: "", needs: "", legalObligation: "", actions: "" },
    ]);

    const [internalIssues, setInternalIssues] = useState([""]);

    const [externalIssues, setExternalIssues] = useState([""]);

    const [relevantRequirements, setRelevantRequirements] = useState([])

    const [riskReasons, setRiskReasons] = useState([]);

    const [ismsCommunication, setIsmsCommunication] = useState([]);

    const [ismsDocuments, setIsmsDocuments] = useState([]);

    // const policies = [
    //     { id: 1, name: "ISMS Scope Policy", description: "Details about ISMS Scope Policy." },
    //     { id: 2, name: "Malware Detection Policy", description: "Details about Malware Detection Policy." },
    //     { id: 3, name: "Privileged Access Management Policy", description: "Details about Privileged Access Management Policy." },
    // ];

    // const policy = policies.find((p) => p.id === parseInt(policyId));
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    // if (!policy) {
    //     return <h2>Policy not found!</h2>;
    // }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLocationChange = (index, value) => {
        const updatedLocations = [...locations];
        updatedLocations[index] = value;
        setLocations(updatedLocations);
        setFormData((prevData) => ({ ...prevData, locations: updatedLocations }));
    };

    const handleAssetChange = (index, value) => {
        const updatedAssets = [...assets];
        updatedAssets[index] = value;
        setAssets(updatedAssets);
        setFormData((prevData) => ({ ...prevData, assets: updatedAssets }));
    };

    // Handle Department Change
    const handleDepartmentChange = (index, value) => {
        const updatedDepartments = [...departments];
        updatedDepartments[index] = value;
        setDepartments(updatedDepartments);
        setFormData((prevData) => ({ ...prevData, departments: updatedDepartments }));
    };

    // Handle changes for predefined objectives
    // const handlePredefinedChange = (index, field, value) => {
    //     const updatedPredefined = [...predefinedObjectives];
    //     updatedPredefined[index][field] = value;
    //     setPredefinedObjectives(updatedPredefined);
    //     setFormData((prevData) => ({ ...prevData, predefinedObjectives: updatedPredefined }));
    // };

    // Handle changes for additional objectives
    const handleObjectiveChange = (index, value) => {
        const updatedObjectives = [...objectives];
        updatedObjectives[index].name = value;
        setObjectives(updatedObjectives);
        setFormData((prevData) => ({ ...prevData, objectives: updatedObjectives }));
    };

    // Handle changes for additional objective details
    const handleObjectiveDetailChange = (index, field, value) => {
        const updatedObjectives = [...objectives];
        updatedObjectives[index][field] = value;
        setObjectives(updatedObjectives);
        setFormData((prevData) => ({ ...prevData, objectives: updatedObjectives }));
    };

    // Handle ISMS Members Change
    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...ismsDetails.members];
        updatedMembers[index][field] = value;
        setIsmsDetails({ ...ismsDetails, members: updatedMembers });
        setFormData((prevData) => ({ ...prevData, ismsDetails: { ...ismsDetails, members: updatedMembers } }));
    };

    // Handle Interested Party Change
    const handleInterestedPartyChange = (index, field, value) => {
        const updatedParties = [...interestedParties];
        updatedParties[index][field] = value;
        setInterestedParties(updatedParties);
        setFormData((prevData) => ({ ...prevData, interestedParties: updatedParties }));
    };

    // Handle Internal Issue Changes
    const handleInternalIssueChange = (index, value) => {
        const updatedIssues = [...internalIssues];
        updatedIssues[index] = value;
        setInternalIssues(updatedIssues);
        setFormData((prevData) => ({ ...prevData, internalIssues: updatedIssues }));
    };

    // Handle External Issue Changes
    const handleExternalIssueChange = (index, value) => {
        const updatedIssues = [...externalIssues];
        updatedIssues[index] = value;
        setExternalIssues(updatedIssues);
        setFormData((prevData) => ({ ...prevData, externalIssues: updatedIssues }));
    };

    const handleRequirementChange = (index, field, value) => {
        const updatedRequirements = [...relevantRequirements];
        updatedRequirements[index][field] = value;
        setRelevantRequirements(updatedRequirements);
        setFormData((prevData) => ({ ...prevData, relevantRequirements: updatedRequirements }));
    };

    const handleRiskReasonChange = (index, value) => {
        const updatedReasons = [...riskReasons];
        updatedReasons[index] = value;
        setRiskReasons(updatedReasons);
        setFormData((prevData) => ({ ...prevData, riskReasons: updatedReasons }));
    };

    const handleCommunicationChange = (index, field, value) => {
        const updatedCommunication = [...ismsCommunication];
        updatedCommunication[index] = {
            ...updatedCommunication[index],
            [field]: value,
        };
        setIsmsCommunication(updatedCommunication);
        setFormData((prevData) => ({
            ...prevData,
            ismsCommunication: updatedCommunication,
        }));
    };

    const handleDocumentationChange = (index, field, value) => {
        const updatedDocuments = [...ismsDocuments];
        updatedDocuments[index][field] = value; 
    
        setIsmsDocuments(updatedDocuments);
    
        setFormData((prevData) => ({
            ...prevData,
            ismsDocuments: updatedDocuments
        }));
    };
    



    const addLocationField = () => {
        setLocations([...locations, ""]);
    };

    const addAssetField = () => {
        setAssets([...assets, ""]);
    };

    const addDepartmentField = () => {
        setDepartments([...departments, ""]);
    };


    // Add a new objective field
    const addObjectiveField = () => {
        setObjectives([...objectives, { name: "", actionPlan: "", effectivenessMeasures: "", resources: "", eta: "" }]);
    };

    // Add New Interested Party Field
    const addInterestedPartyField = () => {
        setInterestedParties([
            ...interestedParties,
            { stakeholder: "", impact: "", needs: "", legalObligation: "", actions: "" },
        ]);
    };

    // Add New Member Field
    const addMemberField = () => {
        setIsmsDetails({
            ...ismsDetails,
            members: [...ismsDetails.members, { name: "", position: "" }],
        });
    };

    // Add New Internal Issue Field
    const addInternalIssueField = () => {
        setInternalIssues([...internalIssues, ""]);
    };

    // Add New External Issue Field
    const addExternalIssueField = () => {
        setExternalIssues([...externalIssues, ""]);
    };

    const addRequirement = () => {
        setRelevantRequirements([
            ...relevantRequirements,
            { regulation: "", contractual: "", circumstances: "", contact: "" }
        ]);
    };

    const addRiskReason = () => {
        const updatedReasons = [...riskReasons, ""];
        setRiskReasons(updatedReasons);
    };

    const addCommunication = () => {
        setIsmsCommunication((prevCommunication) => [
            ...prevCommunication,
            { type: "", recipients: "", owner: "", frequency: "", method: "", approvalRequired: "" },
        ]);
    };

    const addDocumentation = () => {
        const updatedDocuments = [
            ...ismsDocuments,
            {
                documentName: '',
                storageLocation: '',
                ownership: '',
            }
        ];
        setIsmsDocuments(updatedDocuments);
    }


    const GenerateISMS = async () => {
        try {
            console.log(formData)
            const response = await fetch('http://localhost:8000/generateISMS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert("Saved Successfully")

            // // Convert the response to binary data (Blob)
            // const blob = await response.blob();

            // // Create a temporary download link for the file
            // const link = document.createElement('a');
            // link.href = URL.createObjectURL(blob);
            // link.download = 'MalwarePolicy.docx';  // Set the download file name
            // link.click(); 
            // alert("Saved successfully")
        } catch (error) {
            console.error('Error saving ISMS documentation:', error);
            alert('An error occurred while saving ISMS documentation.');
        }
    };



    const renderStepContent = () => {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Step 1: Basic Company Details</h2>
                        <div className="max-h-80 overflow-y-auto p-4 border border-gray-300 rounded-md bg-gray-50 mb-6">
                            <label className="block mb-4">
                                <span className="font-medium">Enter your company name:</span>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName || ""}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                                <span className="font-medium">Enter the type of services your company provides:</span>
                                <input
                                    type="text"
                                    name="companyServices"
                                    value={formData.companyServices || ""}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </label>
                            <h3 className="text-lg font-semibold mb-2">Company Locations:</h3>
                            {locations.map((location, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block">
                                        <span>Location {index + 1}:</span>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => handleLocationChange(index, e.target.value)}
                                            className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLocationField}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                            >
                                + Add Location
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.companyName || !formData.companyServices}
                                className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 disabled:bg-gray-400"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Step 2: Additional Company Details</h2>
                        <div className="max-h-80 overflow-y-auto p-4 border border-gray-300 rounded-md bg-gray-50 mb-6">
                            <h3 className="text-lg font-semibold mb-2">Company Assets:</h3>
                            {assets.map((asset, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block">
                                        <span>Asset {index + 1}:</span>
                                        <input
                                            type="text"
                                            value={asset}
                                            onChange={(e) => handleAssetChange(index, e.target.value)}
                                            className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAssetField}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                            >
                                + Add Asset
                            </button>

                            <h3 className="text-lg font-semibold mt-6 mb-2">Company Departments:</h3>
                            {departments.map((department, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block">
                                        <span>Department {index + 1}:</span>
                                        <input
                                            type="text"
                                            value={department}
                                            onChange={(e) => handleDepartmentChange(index, e.target.value)}
                                            className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDepartmentField}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                            >
                                + Add Department
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
                {
                    step === 3 && (
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Step 3: Information Security Objectives</h2>

                            {/* Scrollable Content Box */}
                            <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-md shadow-md">
                                {/* Predefined Objectives */}
                                

                                {/* Additional Objectives */}
                                <h3 className="text-xl font-semibold mb-3">Additional Objectives</h3>
                                {objectives.map((objective, index) => (
                                    <div key={index} className="mb-4">
                                        <label className="block">
                                            <span className="text-sm font-medium">Objective:</span>
                                            <input
                                                type="text"
                                                className="w-full border rounded-md p-2 mt-1"
                                                value={objective.name}
                                                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                            />
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <label className="block">
                                                <span className="text-sm font-medium">Action Plan:</span>
                                                <input
                                                    type="text"
                                                    className="w-full border rounded-md p-2 mt-1"
                                                    value={objective.actionPlan || ""}
                                                    onChange={(e) => handleObjectiveDetailChange(index, "actionPlan", e.target.value)}
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-medium">Effectiveness Measures:</span>
                                                <input
                                                    type="text"
                                                    className="w-full border rounded-md p-2 mt-1"
                                                    value={objective.effectivenessMeasures || ""}
                                                    onChange={(e) =>
                                                        handleObjectiveDetailChange(index, "effectivenessMeasures", e.target.value)
                                                    }
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-medium">Resources Required:</span>
                                                <input
                                                    type="text"
                                                    className="w-full border rounded-md p-2 mt-1"
                                                    value={objective.resources || ""}
                                                    onChange={(e) => handleObjectiveDetailChange(index, "resources", e.target.value)}
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-medium">ETA:</span>
                                                <input
                                                    type="text"
                                                    className="w-full border rounded-md p-2 mt-1"
                                                    value={objective.eta || ""}
                                                    onChange={(e) => handleObjectiveDetailChange(index, "eta", e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                                    onClick={addObjectiveField}
                                >
                                    + Add Objective
                                </button>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                    onClick={() => setStep(2)}
                                >
                                    Back
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md"
                                    onClick={() => setStep(4)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                {step === 4 && (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Step 4: ISMS Details</h2>

                        {/* ISMS Details */}
                        <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-md shadow-md">
                            {/* ISMS Overview */}
                            <h3 className="text-xl font-semibold mb-3">ISMS Overview</h3>
                            <label className="block mb-4">
                                <span className="text-sm font-medium">Owner of Policy:</span>
                                <input
                                    type="text"
                                    name = "ismsowner"
                                    className="w-full border rounded-md p-2 mt-1"
                                    value={formData.ismsowner || ""}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label className="block mb-4">
                                <span className="text-sm font-medium">Is it a Council or a Committee?</span>
                                <select
                                    name = "ismstype"
                                    className="w-full border rounded-md p-2 mt-1"
                                    value={formData.ismstype || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Council">Council</option>
                                    <option value="Committee">Committee</option>
                                </select>
                            </label>

                            <label className="block mb-4">
                                <span className="text-sm font-medium">Chaired By:</span>
                                <input
                                    type="text"
                                    name = "chairname"
                                    className="w-full border rounded-md p-2 mt-1"
                                    value={formData.chairname || ""}
                                    placeholder="Chairperson Name"
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label className="block mb-4">
                                <span className="text-sm font-medium">Chair Position:</span>
                                <input
                                    type="text"
                                    name = "chairposition"
                                    className="w-full border rounded-md p-2 mt-1"
                                    value={formData.chairposition || ""}
                                    placeholder="Chairperson Position"
                                    onChange={handleInputChange}
                                />
                            </label>

                            {/* ISMS Members */}
                            <h3 className="text-xl font-semibold mb-3">ISMS Members</h3>
                            {ismsDetails.members.map((member, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block">
                                        <span className="text-sm font-medium">Member Name:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={member.name || ""}
                                            onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">Member Position:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={member.position || ""}
                                            onChange={(e) => handleMemberChange(index, "position", e.target.value)}
                                        />
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                                onClick={addMemberField}
                            >
                                + Add Member
                            </button>

                            {/* Interested Parties */}
                            <h3 className="text-xl font-semibold mb-3">Interested Parties</h3>
                            {interestedParties.map((party, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block">
                                        <span className="text-sm font-medium">Stakeholder:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={party.stakeholder || ""}
                                            onChange={(e) => handleInterestedPartyChange(index, "stakeholder", e.target.value)}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">Impact:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={party.impact || ""}
                                            onChange={(e) => handleInterestedPartyChange(index, "impact", e.target.value)}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">Needs/Expectations:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={party.needs || ""}
                                            onChange={(e) => handleInterestedPartyChange(index, "needs", e.target.value)}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">Legal Obligations (Yes/No):</span>
                                        <select
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={party.legalObligation || ""}
                                            onChange={(e) => handleInterestedPartyChange(index, "legalObligation", e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">Actions Required:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={party.actions || ""}
                                            onChange={(e) => handleInterestedPartyChange(index, "actions", e.target.value)}
                                        />
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                                onClick={addInterestedPartyField}
                            >
                                + Add Interested Party
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(3)}
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(5)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {step == 5 && (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Step 5: Internal and External Issues</h2>

                        {/* Internal Issues */}
                        <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-md shadow-md">
                            <h3 className="text-xl font-semibold mb-3">Internal Issues</h3>
                            {internalIssues.map((issue, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block">
                                        <span className="text-sm font-medium">Issue {index + 1}:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={issue || ""}
                                            onChange={(e) => handleInternalIssueChange(index, e.target.value)}
                                        />
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                                onClick={addInternalIssueField}
                            >
                                + Add Issue
                            </button>

                            {/* External Issues */}
                            <h3 className="text-xl font-semibold mb-3 mt-6">External Issues</h3>
                            {externalIssues.map((issue, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block">
                                        <span className="text-sm font-medium">Issue {index + 1}:</span>
                                        <input
                                            type="text"
                                            className="w-full border rounded-md p-2 mt-1"
                                            value={issue || ""}
                                            onChange={(e) => handleExternalIssueChange(index, e.target.value)}
                                        />
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                                onClick={addExternalIssueField}
                            >
                                + Add Issue
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(4)}
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(6)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {step === 6 && (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Step 6: Relevant Laws, Regulations, and Contractual Requirements</h2>

                        {/* Relevant Requirements */}
                        <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-md shadow-md">
                            {relevantRequirements.map((requirement, index) => (
                                <div key={index} className="mb-6 p-4 bg-white rounded-md shadow-md">
                                    <h4 className="text-xl font-semibold mb-3">Requirement {index + 1}</h4>

                                    {/* Regulation/Authorities Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Regulation/Authorities:</label>
                                        <input
                                            type="text"
                                            value={requirement.regulation}
                                            onChange={(e) =>
                                                handleRequirementChange(index, "regulation", e.target.value)
                                            }
                                            className="w-full border rounded-md p-2 mt-1"
                                        />
                                    </div>

                                    {/* Contractual Requirement Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Contractual Requirement:</label>
                                        <input
                                            type="text"
                                            value={requirement.contractual}
                                            onChange={(e) =>
                                                handleRequirementChange(index, "contractual", e.target.value)
                                            }
                                            className="w-full border rounded-md p-2 mt-1"
                                        />
                                    </div>

                                    {/* Circumstances Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Circumstances:</label>
                                        <input
                                            type="text"
                                            value={requirement.circumstances}
                                            onChange={(e) =>
                                                handleRequirementChange(index, "circumstances", e.target.value)
                                            }
                                            className="w-full border rounded-md p-2 mt-1"
                                        />
                                    </div>

                                    {/* Contact Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Contact:</label>
                                        <input
                                            type="text"
                                            value={requirement.contact}
                                            onChange={(e) =>
                                                handleRequirementChange(index, "contact", e.target.value)
                                            }
                                            className="w-full border rounded-md p-2 mt-1"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Button to add another requirement */}
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                            >
                                + Add Requirement
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(5)}
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(7)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 7 && (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Step 7: Risk Assessment</h2>

                        {/* Reasons for Risk Assessment */}
                        <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-md shadow-md mb-6">
                            <h3 className="text-xl font-semibold mb-3">Reasons for Performing Risk Assessment</h3>
                            {riskReasons.length > 0 && riskReasons.map((reason, index) => (
                                <div key={index} className="mb-4 p-4 bg-white rounded-md shadow-sm">
                                    <label className="block text-sm font-medium mb-2">
                                        Reason {index + 1}:
                                    </label>
                                    <input
                                        type="text"
                                        value={reason}
                                        onChange={(e) => handleRiskReasonChange(index, e.target.value)}
                                        className="w-full border rounded-md p-2 mt-1"
                                    />
                                </div>
                            ))}
                            {/* Button to add another reason */}
                            <button
                                type="button"
                                onClick={addRiskReason}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                            >
                                + Add Reason
                            </button>
                        </div>

                        {/* Frequency of Risk Assessment */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">Frequency of Risk Assessment</h3>
                            <label className="block text-sm font-medium mb-2">
                                How often should risk assessments be performed?
                            </label>
                            <input
                                type="text"
                                value={formData.riskFrequency}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="e.g., Annually, Quarterly, After major changes"
                                className="w-full border rounded-md p-2 mt-1"
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(prevStep => prevStep - 1)}
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(nextStep => nextStep + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 8 && (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Step 8: ISMS Communication</h2>

                        {/* ISMS Communication Details */}
                        <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-md shadow-md mb-6">
                            <h3 className="text-xl font-semibold mb-3">ISMS Communication Overview</h3>
                            {ismsCommunication.map((communication, index) => (
                                <div key={index} className="mb-4 p-4 bg-white rounded-md shadow-sm">
                                    <label className="block text-sm font-medium mb-2">
                                        Communication Type:
                                    </label>
                                    <select
                                        value={communication.type}
                                        onChange={(e) => handleCommunicationChange(index, 'type', e.target.value)}
                                        className="w-full border rounded-md p-2 mt-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                    </select>

                                    <label className="block text-sm font-medium mb-2 mt-2">
                                        Recipients:
                                    </label>
                                    <input
                                        type="text"
                                        value={communication.recipients}
                                        onChange={(e) => handleCommunicationChange(index, 'recipients', e.target.value)}
                                        className="w-full border rounded-md p-2 mt-1"
                                    />

                                    <label className="block text-sm font-medium mb-2 mt-2">
                                        Owner/ Sender:
                                    </label>
                                    <input
                                        type="text"
                                        value={communication.owner}
                                        onChange={(e) => handleCommunicationChange(index, 'owner', e.target.value)}
                                        className="w-full border rounded-md p-2 mt-1"
                                    />

                                    <label className="block text-sm font-medium mb-2 mt-2">
                                        Frequency:
                                    </label>
                                    <select
                                        value={communication.frequency}
                                        onChange={(e) => handleCommunicationChange(index, 'frequency', e.target.value)}
                                        className="w-full border rounded-md p-2 mt-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                    </select>

                                    <label className="block text-sm font-medium mb-2 mt-2">
                                        Communication Method:
                                    </label>
                                    <input
                                        type="text"
                                        value={communication.method}
                                        onChange={(e) => handleCommunicationChange(index, 'method', e.target.value)}
                                        className="w-full border rounded-md p-2 mt-1"
                                    />

                                    <label className="block text-sm font-medium mb-2 mt-2">
                                        Approval Required:
                                    </label>
                                    <select
                                        value={communication.approvalRequired}
                                        onChange={(e) => handleCommunicationChange(index, 'approvalRequired', e.target.value)}
                                        className="w-full border rounded-md p-2 mt-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            ))}

                            {/* Button to add another communication */}
                            <button
                                type="button"
                                onClick={addCommunication}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                            >
                                + Add Communication
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(prevStep => prevStep - 1)}
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(prevStep => prevStep + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 9 && (
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Step 9: ISMS Documentation</h2>

                        {/* ISMS Documentation Details */}
                        <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded-md shadow-md mb-6">
                            <h3 className="text-xl font-semibold mb-3">ISMS Documentation Overview</h3>

                            {ismsDocuments.length > 0 && ismsDocuments.map((document, index) => (
                                <div key={index} className="mb-4 p-4 bg-white rounded-md shadow-sm">
                                    {/* Document Name */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Document Name:</label>
                                        <input
                                            type="text"
                                            value={document.documentName}
                                            onChange={(e) => handleDocumentationChange(index, 'documentName', e.target.value)}
                                            className="w-full border rounded-md p-2 mt-1"
                                            placeholder="Enter Document Name"
                                        />
                                    </div>

                                    {/* Storage Location */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Storage Location:</label>
                                        <input
                                            type="text"
                                            value={document.storageLocation}
                                            onChange={(e) => handleDocumentationChange(index, 'storageLocation', e.target.value)}
                                            className="w-full border rounded-md p-2 mt-1"
                                            placeholder="Enter Storage Location"
                                        />
                                    </div>

                                    {/* Ownership */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Ownership:</label>
                                        <input
                                            type="text"
                                            value={document.ownership}
                                            onChange={(e) => handleDocumentationChange(index, 'ownership', e.target.value)}
                                            className="w-full border rounded-md p-2 mt-1"
                                            placeholder="Enter Owner Name"
                                        />
                                    </div>
                                    
                                </div>
                            ))}

                            {/* Button to add another document */}
                            <button
                                type="button"
                                onClick={addDocumentation}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md shadow-md mt-2"
                            >
                                + Add Documentation
                            </button>
                        </div>

                        {/* Save Button to Submit Data */}
                        <div className="flex justify-between mt-6">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={() => setStep(prevStep => prevStep - 1)} // Go back to the previous step
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md"
                                onClick={GenerateISMS} // Call save function
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}

            </div >
        );


        
    };

    return (
        <div>
            <h1>ISMS</h1>
            {renderStepContent()}
        </div>
    );
};

export default IsmsPolicy;