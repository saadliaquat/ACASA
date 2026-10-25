import type { ObjectId } from "mongodb"

// Control Document schema
export interface ControlDocument {
  id: string
  name: string
  originalFilename: string
  classification: string
  label: string
  notes: string
  uploadDate: string
  uploadedBy: {
    id: string
    name: string
  }
  fileType: string
  fileSize: string
  fileData: string
}

// User schema
export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string // This would be hashed
  jobTitle?: string
  department?: string
  phone?: string
  bio?: string
  profilePicture?: string
  role: "admin" | "auditor" | "user"
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

// Control schema (ISO27001 controls)
export interface Control {
  _id?: ObjectId | string
  id: string // Control ID (e.g., "6.1")
  name: string
  description?: string
  compliant: boolean
  hasDocument: boolean
  canAutomate: boolean
  category: string // e.g., "Information Security Policies"
  documentIds?: ObjectId[] // References to supporting documents
  documents?: ControlDocument[] // Actual document data
  assignedTo?: ObjectId // User responsible
  lastReviewDate?: Date
  nextReviewDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Policy document schema
export interface Policy {
  _id?: ObjectId
  name: string
  status: "Draft" | "Review" | "Published"
  content: string
  version: string
  createdBy: ObjectId // Reference to user
  lastUpdated: Date
  relatedControls?: string[] // Control IDs related to this policy
  createdAt: Date
  updatedAt: Date
}

// Report schema
export interface Report {
  _id?: ObjectId
  id: string // Report ID (e.g., "REP-2024-001")
  name: string
  type: "Compliance" | "Assessment" | "Audit" | "Security"
  date: Date
  status: "Draft" | "Completed"
  content: string // Could be JSON or HTML content
  generatedBy: ObjectId // Reference to user
  createdAt: Date
  updatedAt: Date
}

// Activity log schema
export interface Activity {
  _id?: ObjectId
  userId: ObjectId
  userName: string
  action: string
  target: string
  targetType: "control" | "policy" | "report" | "user" | "system"
  timestamp: Date;
  details?: any
}

// Dashboard statistics schema
export interface ComplianceStats {
  _id?: ObjectId | string
  totalControls: number
  compliantControls: number
  nonCompliantControls: number
  criticalFindings: number
  lastUpdated: Date
  categoryStats: {
    category: string
    compliant: number
    total: number
    percentage: number
    criticalFindings: number
  }[]
}

export interface AutomationResult {
  _id?: string | ObjectId
  controlId: string
  scriptId: string
  scriptName: string
  status: "success" | "failure" | "error"
  compliant: boolean
  report: string
  runAt: Date
}

export type Script = {
  _id?: string
  scriptId: string
  controlId: string
  scriptName: string
  language: "bash" | "python" | "powershell" | "node" | "sh" | "py"
  fileName: string
  code: string
  createdAt: Date
  updatedAt: Date
}

export interface AppSetting {
  _id?: string | ObjectId
  key: "general"
  value: {
    companyName: string
    industry: string
    website: string
    contactEmail: string
  }
  updatedAt: Date
}
