"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../lib/mongodb"
import { z } from "zod"

// Define schema for AWS credentials
const awsCredentialsSchema = z.object({
  accessKeyId: z.string().min(16, "Access Key ID must be at least 16 characters"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  sessionToken: z.string().optional(),
  organizationId: z.string().optional(),
})

type AWSCredentials = z.infer<typeof awsCredentialsSchema>

// AWS SDK for credential validation
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts"

export async function validateAwsCredentials(formData: FormData) {
  try {
    // Extract values from form data
    const accessKeyId = formData.get("accessKeyId") as string
    const secretAccessKey = formData.get("secretAccessKey") as string
    const sessionToken = (formData.get("sessionToken") as string) || undefined
    const organizationId = (formData.get("organizationId") as string) || undefined

    // Validate the form data
    const result = awsCredentialsSchema.safeParse({
      accessKeyId,
      secretAccessKey,
      sessionToken,
      organizationId,
    })

    if (!result.success) {
      return {
        success: false,
        error: "Invalid credentials format",
        details: result.error.format(),
      }
    }

    // Create STS client to validate credentials
    const stsClient = new STSClient({
      region: "us-east-1", // Default region for validation
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      },
    })

    try {
      // Test credentials by getting caller identity
      const command = new GetCallerIdentityCommand({})
      const identityResponse = await stsClient.send(command)

      // Get AWS account ID from the response
      const accountId = identityResponse.Account

      // Store credentials in database
      const { db } = await connectToDatabase()

      // Check if credentials already exist for this organization
      const existingCredentials = await db.collection("data").findOne({
        type: "aws_credentials",
        ...(organizationId ? { organizationId } : {}),
      })

      if (existingCredentials) {
        // Update existing credentials
        await db.collection("data").updateOne(
          { _id: existingCredentials._id },
          {
            $set: {
              accessKeyId,
              secretAccessKey,
              ...(sessionToken ? { sessionToken } : {}),
              accountId,
              lastValidated: new Date(),
              isValid: true,
            },
          },
        )
      } else {
        // Insert new credentials
        await db.collection("data").insertOne({
          type: "aws_credentials",
          accessKeyId,
          secretAccessKey,
          ...(sessionToken ? { sessionToken } : {}),
          ...(organizationId ? { organizationId } : {}),
          accountId,
          createdAt: new Date(),
          lastValidated: new Date(),
          isValid: true,
        })
      }

      revalidatePath("/settings")

      return {
        success: true,
        message: "AWS credentials validated and stored successfully",
        accountId,
      }
    } catch (validationError: any) {
      console.error("AWS validation error:", validationError)

      // Store invalid credentials with error info
      const { db } = await connectToDatabase()

      // Check if credentials already exist for this organization
      const existingCredentials = await db.collection("data").findOne({
        type: "aws_credentials",
        ...(organizationId ? { organizationId } : {}),
      })

      if (existingCredentials) {
        // Update existing credentials with validation failure
        await db.collection("data").updateOne(
          { _id: existingCredentials._id },
          {
            $set: {
              accessKeyId,
              secretAccessKey,
              ...(sessionToken ? { sessionToken } : {}),
              lastValidated: new Date(),
              isValid: false,
              validationError: validationError.message || "Unknown validation error",
            },
          },
        )
      }

      return {
        success: false,
        error: "Invalid AWS credentials",
        details: validationError.message || "Could not validate credentials",
      }
    }
  } catch (error: any) {
    console.error("Error processing AWS credentials:", error)
    return {
      success: false,
      error: "An error occurred while processing AWS credentials",
      details: error.message,
    }
  }
}

export async function getAwsCredentials(organizationId?: string) {
  try {
    const { db } = await connectToDatabase()

    const credentials = await db.collection("data").findOne({
      type: "aws_credentials",
      ...(organizationId ? { organizationId } : {}),
    })

    if (!credentials) {
      return {
        success: false,
        error: "No AWS credentials found",
      }
    }

    // Don't return the actual secret key, just a masked version
    const maskedCredentials = {
      ...credentials,
      secretAccessKey: "••••••••••••••••",
      sessionToken: credentials.sessionToken ? "••••••••••••••••" : undefined,
      _id: credentials._id.toString(),
    }

    return {
      success: true,
      credentials: maskedCredentials,
    }
  } catch (error: any) {
    console.error("Error fetching AWS credentials:", error)
    return {
      success: false,
      error: "Failed to fetch AWS credentials",
      details: error.message,
    }
  }
}

export async function deleteAwsCredentials(organizationId?: string) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("data").deleteOne({
      type: "aws_credentials",
      ...(organizationId ? { organizationId } : {}),
    })

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: "No AWS credentials found to delete",
      }
    }

    revalidatePath("/settings")

    return {
      success: true,
      message: "AWS credentials deleted successfully",
    }
  } catch (error: any) {
    console.error("Error deleting AWS credentials:", error)
    return {
      success: false,
      error: "Failed to delete AWS credentials",
      details: error.message,
    }
  }
}

