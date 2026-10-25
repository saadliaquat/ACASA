"use server"

import { revalidatePath } from "next/cache"
import { getDb } from "../lib/db"
import { ObjectId } from "mongodb"
import { writeFile, unlink } from "fs/promises"
import { randomUUID } from "crypto"
import path from "path"
import os from "os"
import { exec } from "child_process"
import { promisify } from "util"
import type { AutomationResult } from "../types/database"


const execAsync = promisify(exec)

export async function runAutomationScript(controlId: string, scriptId: string, scriptName: string) {
    try {
      const db = await getDb()
  
      // Retrieve the script from the DB
      const script = await db.collection("scripts").findOne({ _id: new ObjectId(scriptId) })
      if (!script || !script.code) {
        return { success: false, error: "Script not found" }
      }
  
      // Write the script code to a temporary file
      const tempFilename = `${randomUUID()}.py`
      const tempPath = path.join(os.tmpdir(), tempFilename)
      await writeFile(tempPath, script.code, { mode: 0o755 })
  
      let stdout = ""
      let stderr = ""
      let status: "success" | "failure" | "error" = "error"
      let compliant = false
      let report = ""
      const runAt = new Date()
  
      try {
        // Execute the Python script
        const result = await execAsync(`python3 ${tempPath}`)
        stdout = result.stdout.trim()
  
        // Try parsing the output as JSON
        let parsed: any = null
        try {
          parsed = JSON.parse(stdout)
        } catch (jsonError) {
          parsed = null
        }
  
        // Check that the parsed output contains the expected keys
        if (
          parsed &&
          typeof parsed.status === "string" &&
          typeof parsed.compliant === "boolean" &&
          typeof parsed.report === "string"
        ) {
          status = parsed.status
          compliant = parsed.compliant
          report = parsed.report
        } else {
          // Fallback if the output is not in the expected format
          status = "error"
          compliant = false
          report = stdout || "Invalid script output format"
        }
      } catch (err: any) {
        // Handle errors from execAsync
        stderr = err.stderr?.toString() || err.message
        stdout = err.stdout?.toString() || ""
        status = "error"
        compliant = false
        report = stderr || stdout || "No output"
      }
  
      // Build a plain object for the result document.
      // Convert runAt to a string to ensure only plain values are passed.
      const resultDoc: Record<string, any> = {
        controlId,
        scriptId,
        scriptName,
        status,
        compliant,
        report,
        runAt: runAt.toISOString(),
      }
  
      // Insert the automation result and convert the _id to a plain string.
      const insertResult = await db.collection("automationResults").insertOne(resultDoc)
      resultDoc._id = insertResult.insertedId.toString()
  
      // Update the corresponding control's automation status
      await db.collection("controls").updateOne(
        { id: controlId },
        {
          $set: {
            automationStatus: compliant ? "compliant" : "non-compliant",
            lastAutomationRun: runAt,
          },
        }
      )
  
      // Update the script's metadata
      await db.collection("scripts").updateOne(
        { id: scriptId },
        {
          $set: {
            lastRun: runAt,
            lastStatus: compliant ? "compliant" : "non-compliant",
          },
        }
      )
  
      // Remove the temporary file and revalidate the page
      await unlink(tempPath)
      revalidatePath("/controls")
  
      return {
        success: true,
        result: resultDoc,
      }
    } catch (error) {
      console.error("Error running automation script:", error)
      return {
        success: false,
        error: "Failed to run automation script",
      }
    }
  }


export async function getAutomationHistory(controlId: string) {
    try {
      const db = await getDb()
  
      // Tell TypeScript what type to expect from MongoDB
      const historyRaw = await db
        .collection<AutomationResult>("automationResults")
        .find({ controlId })
        .sort({ runAt: -1 })
        .toArray()
  
      // Convert ObjectId _id to string
      const history: AutomationResult[] = historyRaw.map((item) => ({
        ...item,
        _id: item._id?.toString(), // override _id with string version
      }))
  
      return {
        success: true,
        history,
      }
    } catch (error) {
      console.error("Error fetching automation history:", error)
      return {
        success: false,
        error: "Failed to fetch automation history",
      }
    }
  }
  
  export async function fetchScripts(controlId: string) {
    try {
      const db = await getDb()
      const scripts = await db
        .collection("scripts")
        .find({ controlId })
        .project({ _id: 1, scriptName: 1, description: 1 }) // return minimal fields
        .toArray()
  
      const formatted = scripts.map((script) => ({
        id: script._id.toString(),
        name: script.scriptName,
        description: script.description,
        path: `/scripts/${controlId}/${script._id.toString()}`,
      }))
  
      return { success: true, scripts: formatted }
    } catch (error) {
      console.error("Error fetching scripts:", error)
      return { success: false, error: "Failed to fetch scripts" }
    }
  }