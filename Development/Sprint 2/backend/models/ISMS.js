const mongoose = require('mongoose');

const ismsSchema = new mongoose.Schema({
    companyName: {
        type: String,
        default: ""
    },
    companyServices: {
        type: String,
        default: "",
    },
    locations: {
        type: [String], 
        default: [""]
    },
    assets: {
        type: [String], 
        default: [""]
    },
    departments: {
        type: [String], 
        default: [""]
    },
    objectives: [
        {
            name: { type: String, default: "" },
            actionPlan: { type: String, default: "" },
            effectivenessMeasures: { type: String, default: "" },
            resources: { type: String, default: "" },
            eta: { type: String, default: "" }
        }
    ],
    ismsDetails: {
        owner: { type: String, default: "" },
        type: { type: String, default: "" },
        chair: {
            name: { type: String, default: "" },
            position: { type: String, default: "" }
        },
        members: [
            {
                name: { type: String, default: "" },
                position: { type: String, default: "" }
            }
        ]
    },
    interestedParties: [
        {
            stakeholder: { type: String, default: "" },
            impact: { type: String, default: "" },
            needs: { type: String, default: "" },
            legalObligation: { type: String, default: "" },
            actions: { type: String, default: "" }
        }
    ],
    internalIssues: {
        type: [String], 
        default: [""]
    },
    externalIssues: {
        type: [String], 
        default: [""]
    },
    relevantRequirements: [
        {
            regulation: { type: String, default: "" },
            contactualRequirement: { type: String, default: "" },
            circumstances: { type: String, default: "" },
            contact: { type: String, default: "" }
        }
    ],
    riskReasons: {
        type: [String], 
        default: []
    },
    ismsCommunication: [
        {
            type: { type: String, default: "" },
            recipients: { type: String, default: "" },
            ownersender: { type: String, default: "" },
            frequency: { type: String, default: "" },
            communication: { type: String, default: "" },
            approval: { type: String, default: "" }
        }
    ],
    ismsDocuments: [
        {
            name: { type: String, default: "" },
            storage: { type: String, default: "" },
            ownership: { type: String, default: "" }
        }
    ]
}); 

const ISMS = mongoose.model('ISMS', ismsSchema);

module.exports = ISMS;
