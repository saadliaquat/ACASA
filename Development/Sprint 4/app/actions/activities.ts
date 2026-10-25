"use server"

import { getRecentActivities } from "../lib/db"

export async function fetchRecentActivities(limit = 5) {
  try {
    const activities = await getRecentActivities(limit)
    // Map each activity to a plain object
    const plainActivities = activities.map((activity) => ({
      ...activity,
      _id: activity._id ? activity._id.toString() : null,
      userId: activity.userId ? activity.userId.toString() : null,
      timestamp: activity.timestamp ? activity.timestamp.toISOString() : null,
    }))
    return { success: true, data: plainActivities }
  } catch (error) {
    console.error("Error fetching activities:", error)
    return { success: false, error: "Failed to fetch activities" }
  }
}


