"use server"

import { getComplianceStats, updateComplianceStats, getControls } from "../lib/db"
import type { ComplianceStats } from "../types/database"

export async function fetchComplianceStats() {
  try {
    // Fetch the updated stats from the database.
    const stats = await getComplianceStats()
    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching compliance stats:", error)
    return { success: false, error: "Failed to fetch compliance stats" }
  }
}

export async function recalculateComplianceStats() {
  try {
    // Get all controls from the database.
    const controls = await getControls()
    if (!controls || controls.length === 0) {
      const stats: ComplianceStats = {
        totalControls: 0,
        compliantControls: 0,
        nonCompliantControls: 0,
        criticalFindings: 0,
        lastUpdated: new Date(),
        categoryStats: [],
      }
      await updateComplianceStats(stats)
      return { success: true, data: stats }
    }

    // Group controls by category using a Map.
    const categoriesMap = new Map<string, { total: number; compliant: number; critical: number }>()
    controls.forEach((control) => {
      // Use control.category (or "Uncategorized" if missing)
      const cat = control.category || "Uncategorized"
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, { total: 0, compliant: 0, critical: 0 })
      }
      const statsForCat = categoriesMap.get(cat)!
      statsForCat.total++
      if (control.compliant) {
        statsForCat.compliant++
      }
      // For demo: treat non-compliant controls that can be automated as critical.
      if (!control.compliant && control.canAutomate) {
        statsForCat.critical++
      }
    })

    // Convert the map to an array of categoryStats.
    const categoryStats = Array.from(categoriesMap.entries()).map(([category, { total, compliant, critical }]) => ({
      category,
      total,
      compliant,
      percentage: total ? Math.round((compliant / total) * 100) : 0,
      criticalFindings: critical,
    }))

    // Calculate overall stats.
    const totalControls = controls.length
    const compliantControls = controls.filter((c) => c.compliant).length
    const criticalFindings = categoryStats.reduce((sum, stat) => sum + stat.criticalFindings, 0)

    const stats: ComplianceStats = {
      totalControls,
      compliantControls,
      nonCompliantControls: totalControls - compliantControls,
      criticalFindings,
      lastUpdated: new Date(),
      categoryStats,
    }

    // Update stats in the database.
    await updateComplianceStats(stats)

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error recalculating compliance stats:", error)
    return { success: false, error: "Failed to recalculate compliance stats" }
  }
}
