"use server"

// import { revalidatePath } from "next/cache"
// import { connectToDatabase } from "../lib/mongodb"
// import { ObjectId, UpdateFilter } from "mongodb"
// import { formatFileSize } from "../lib/utils"
// import type { ControlDocument, Control } from "../types/database"

"use server"

import { revalidatePath } from "next/cache"
import { getDb } from "../lib/db"
import { ObjectId, GridFSBucket, UpdateFilter } from "mongodb"
import { formatFileSize } from "../lib/utils"
import type { Control, ControlDocument } from "../types/database"

export async function uploadControlDocuments(
  controlId: string,
  files: {
    name: string
    type: string
    size: number
    base64: string
  }[],
  metadata: {
    name: string
    classification: string
    label: string
    notes: string
  },
  userId: string,
  userName: string,
) {
  try {

    const db = await getDb()

    // [CHANGE] Instead of always converting controlId to an ObjectId,
    // we check if it's valid. If it's not, we query by the custom "id" field.
    const query = ObjectId.isValid(controlId)
      ? { _id: new ObjectId(controlId) }
      : { id: controlId }

    // console.log("Update query:", query);

    // Create a GridFSBucket instance to handle larger file uploads.
    const bucket = new GridFSBucket(db, { bucketName: "documents" })

    const documentRecords = []

    for (const file of files) {
      // Convert base64 file data into a Buffer.
      const fileBuffer = Buffer.from(file.base64, "base64")

      // Upload file to GridFS using event listeners.
      const fileInfo = await new Promise<any>((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.name, {
          contentType: file.type,
          metadata: {
            controlId,
            documentName: metadata.name,
            classification: metadata.classification,
            label: metadata.label,
            notes: metadata.notes,
            uploadedBy: { id: userId, name: userName },
            fileSize: formatFileSize(file.size),
            uploadDate: new Date(),
          },
        })

        uploadStream.on("finish", () => {
          resolve({ _id: uploadStream.id })
        })
        uploadStream.on("error", reject)
        uploadStream.end(fileBuffer)
      })

      // Use GridFS file _id as the fileData to meet the schema requirement.
      documentRecords.push({
        id: fileInfo._id.toString(),
        originalFilename: file.name,
        name: metadata.name,
        classification: metadata.classification,
        label: metadata.label,
        notes: metadata.notes,
        uploadDate: new Date().toISOString(),
        uploadedBy: { id: userId, name: userName },
        fileType: file.type,
        fileSize: formatFileSize(file.size),
        fileData: fileInfo._id.toString(), // includes fileData to satisfy ControlDocument.
      })
    }
    
    // Use the conditional query to update the control document.
    await db.collection<Control>("controls").updateOne(
      query,
      {
        $push: { documents: { $each: documentRecords } },
        $set: { hasDocument: true },
      }
    )




    revalidatePath("/dashboard/controls")
    return { success: true }
  } catch (error) {
    console.error("Error uploading control documents:", error)
    return { success: false, error: "Failed to upload documents" }
  }
}


export async function deleteControlDocument(controlId: string, documentId: string) {
  try {
    const db = await getDb()

    // Build a conditional query: if controlId is a valid ObjectId, use _id; otherwise, use the custom "id" field.
    const query = ObjectId.isValid(controlId)
      ? { _id: new ObjectId(controlId) }
      : { id: controlId }

    // Remove the document from the documents array.
    const updateFilter: UpdateFilter<Control> = {
      $pull: { documents: { id: documentId } as Partial<ControlDocument> }
    }

    // Update the control, pulling the matching document.
    const updateResult = await db.collection<Control>("controls").updateOne(query, updateFilter)
    console.log("Delete update result:", updateResult)

    // Check if any documents remain.
    const control = await db.collection<Control>("controls").findOne(query, { projection: { documents: 1 } })

    // If no documents are left, update hasDocument to false.
    if (control != null && (!control.documents || control.documents.length === 0)) {
      await db.collection<Control>("controls").updateOne(query, { $set: { hasDocument: false } })
    }

    revalidatePath("/dashboard/controls")
    return { success: true }
  } catch (error) {
    console.error("Error deleting control document:", error)
    return { success: false, error: "Failed to delete document" }
  }
}

export async function getControlWithDocuments(controlId: string) {
  try {
    const db = await getDb()

    const query = ObjectId.isValid(controlId)
    ? { _id: new ObjectId(controlId) }
    : { id: controlId }

    const control = await db.collection("controls").findOne(query)

    if (!control) {
      return { success: false, error: "Control not found" }
    }

    return {
      success: true,
      data: {
        ...control,
        _id: control._id.toString(),
        id: control.id.toString(),
        documents: control.documents || [],
      },
    }
  } catch (error) {
    console.error("Error fetching control with documents:", error)
    return { success: false, error: "Failed to fetch control" }
  }
}

