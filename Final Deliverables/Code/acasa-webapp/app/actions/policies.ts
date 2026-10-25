"use server"

import { getPolicies, getPolicyById, getPolicyByUserAndName, createPolicy, updatePolicy, logActivity, getPoliciesByUser } from "../lib/db"
import { ObjectId } from "mongodb"
import type { Policy } from "../types/database"

export async function fetchPolicies() {
  try {
    const policies = await getPolicies()
    return { success: true, data: policies }
  } catch (error) {
    console.error("Error fetching policies:", error)
    return { success: false, error: "Failed to fetch policies" }
  }
}

export async function fetchPolicyById(id: string) {
  try {
    const policy = await getPolicyById(id)
    if (!policy) {
      return { success: false, error: "Policy not found" }
    }
    return { success: true, data: policy }
  } catch (error) {
    console.error("Error fetching policy:", error)
    return { success: false, error: "Failed to fetch policy" }
  }
}

export async function fetchPoliciesByUser(userId: string) {
  try {
    const policies = await getPoliciesByUser(userId)
    console.log("Policies fetched by user:", policies)
    return { success: true, data: policies }

  } catch (error) {
    console.error("Error fetching policy:", error)
    return { success: false, error: "Failed to fetch policy" }
  }
}

export async function fetchPolicyByUserAndName(userId: string, name: string) {
  try {
    console.log("Fetching policy by user and name:", { userId, name })
    const policy = await getPolicyByUserAndName(userId, name)
    console.log("Policy fetched by user and name:", policy)
    if (!policy) {
      return { success: false, error: "Policy not found" }
    }
    return { success: true, data: policy }
  } catch (error) {
    console.error("Error fetching policy:", error)
    return { success: false, error: "Failed to fetch policy" }
  }
}

export async function createNewPolicy(policyData: FormData, userId: string, userName: string) {
  try {
    const name = policyData.get("name") as string
    const content = policyData.get("content") as string
    const status = policyData.get("status") as "Draft" | "Review" | "Published"
    const relatedControls = policyData.get("relatedControls") as string

    if (!name || !content) {
      return { success: false, error: "Name and content are required" }
    }

    const newPolicy: Omit<Policy, "_id"> = {
      name,
      content,
      status: status || "Draft",
      version: "1.0",
      createdBy: new ObjectId(userId),
      lastUpdated: new Date(),
      relatedControls: relatedControls ? relatedControls.split(",") : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const policyId = await createPolicy(newPolicy)

    // Log the activity
    await logActivity({
      userId: new ObjectId(userId),
      userName,
      action: "created a new policy",
      target: name,
      targetType: "policy",
      timestamp: new Date(),
      details: { policyId },
    })

    return { success: true, data: { id: policyId } }
  } catch (error) {
    console.error("Error creating policy:", error)
    return { success: false, error: "Failed to create policy" }
  }
}

export async function updateExistingPolicy(id: string, policyData: FormData, userId: string, userName: string) {
  try {
    const name = policyData.get("name") as string
    const content = policyData.get("content") as string
    const status = policyData.get("status") as "Draft" | "Review" | "Published"
    const relatedControls = policyData.get("relatedControls") as string

    if (!name || !content) {
      return { success: false, error: "Name and content are required" }
    }

    const updateData: Partial<Policy> = {
      name,
      content,
      status,
      lastUpdated: new Date(),
      relatedControls: relatedControls ? relatedControls.split(",") : [],
    }

    const success = await updatePolicy(id, updateData)

    if (success) {
      // Log the activity
      await logActivity({
        userId: new ObjectId(userId),
        userName,
        action: "updated policy",
        target: name,
        targetType: "policy",
        timestamp: new Date(),
        details: { policyId: id },
      })

      return { success: true }
    }

    return { success: false, error: "Failed to update policy" }
  } catch (error) {
    console.error("Error updating policy:", error)
    return { success: false, error: "Failed to update policy" }
  }
}

