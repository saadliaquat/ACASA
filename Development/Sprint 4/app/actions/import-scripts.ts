"use server"

import { revalidatePath } from "next/cache"
import { getDb } from "../lib/db"

export async function importScript(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const controlId = formData.get("controlId") as string
    const language = formData.get("language") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!file || !controlId) {
      return { success: false, error: "Missing required fields" }
    }

    const scriptContent = await file.text()

    // Auto-detect language based on file extension if not provided
    let detectedLanguage = language
    if (!detectedLanguage) {
      const extension = file.name.split(".").pop()?.toLowerCase()
      switch (extension) {
        case "py":
          detectedLanguage = "python"
          break
        case "js":
          detectedLanguage = "javascript"
          break
        case "sh":
          detectedLanguage = "bash"
          break
        case "ps1":
          detectedLanguage = "powershell"
          break
        default:
          detectedLanguage = "unknown"
      }
    }

    const db = await getDb()

    // ✅ Validate control exists
    const control = await db.collection("controls").findOne({ id: controlId })

    if (!control) {
      return { success: false, error: "Control not found" }
    }

    const scriptNameToUse = name || file.name

    // ✅ Check if a script with the same name already exists for this control
    const duplicate = await db.collection("scripts").findOne({
      controlId,
      scriptName: scriptNameToUse,
    })

    if (duplicate) {
      return { success: false, error: `A script named "${scriptNameToUse}" already exists for this control.` }
    }

    // ✅ Insert the new script
    const script = {
      controlId,
      scriptName: scriptNameToUse,
      description: description || `Script for ${control.name}`,
      language: detectedLanguage,
      code: scriptContent,
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      lastRun: null,
      status: "ready",
    }

    const insertResult = await db.collection("scripts").insertOne(script)

    // ✅ Update control: add script reference and enable hasAutomate if needed
    await db.collection("controls").updateOne(
      { id: controlId },
      {
        $push: { scripts: insertResult.insertedId } as any,
        $set: {
          canAutomate: control.canAutomate ? control.canAutomate : true,
        },
      }
    )

    revalidatePath("/controls")

    return {
      success: true,
      message: "Script imported successfully",
      scriptId: insertResult.insertedId.toString(),
    }
  } catch (error) {
    console.error("Error importing script:", error)
    return { success: false, error: "Failed to import script" }
  }
}
