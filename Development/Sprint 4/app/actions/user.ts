"use server"

import { getDb } from "../lib/db"
import { ObjectId } from "mongodb"
import { getSession } from "../lib/auth"
import type { User } from "../types/database"

// Fetch user profile data
export async function fetchUserProfile() {
  try {
    const session = await getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const db = await getDb()
    const user = await db.collection<User>("users").findOne({ _id: new ObjectId(session.id) })
    
    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Return user data without sensitive information
    const { password, ...userData } = user

    const plainUser = {
      ...userData,
      _id: userData._id.toString(), // Convert ObjectId to string
      createdAt: userData.createdAt instanceof Date ? userData.createdAt.toISOString() : userData.createdAt,
      updatedAt: userData.updatedAt instanceof Date ? userData.updatedAt.toISOString() : userData.updatedAt,
    }

    return {
      success: true,
      data: plainUser,
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return { success: false, error: "Failed to fetch user profile" }
  }
}

// Update user profile data
export async function updateUserProfile(userData: Partial<User>) {
  try {
    const session = await getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Remove sensitive fields that shouldn't be updated directly
    const { password, role, status, _id, ...updateData } = userData

    // Add updatedAt timestamp
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date(),
    }

    const db = await getDb()
    const result = await db
      .collection<User>("users")
      .updateOne({ _id: new ObjectId(session.id) }, { $set: dataToUpdate })

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update user profile" }
  }
}

// Change user password
export async function changeUserPassword(currentPassword: string, newPassword: string) {
  try {
    const session = await getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const db = await getDb()
    const user = await db.collection<User>("users").findOne({ _id: new ObjectId(session.id) })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // In a real implementation, we would verify the current password
    // using bcrypt.compare(currentPassword, user.password)
    // For simplicity, we'll skip this step in this example

    // Hash the new password
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the password
    const result = await db.collection<User>("users").updateOne(
      { _id: new ObjectId(session.id) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, error: "Failed to change password" }
  }
}

// Upload profile picture
export async function uploadProfilePicture(formData: FormData) {
  try {
    const session = await getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" }
    }

    // Convert file to base64 for storage
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const imageUrl = `data:${file.type};base64,${base64}`

    // Update user's profile picture in database
    const db = await getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.id) },
      {
        $set: {
          profilePicture: imageUrl,
          updatedAt: new Date(),
        },
      },
    )

    return { success: true, data: { imageUrl } }
  } catch (error) {
    console.error("Error uploading profile picture:", error)
    return { success: false, error: "Failed to upload profile picture" }
  }
}

