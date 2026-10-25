import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { getDb } from "./db"
import { redirect } from "next/navigation"
import { z } from "zod"
import bcrypt from "bcryptjs"
import type { User } from "../types/database"

// Secret key for JWT signing - in production, use a proper secret from environment variables
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// Session duration - 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 // in seconds

// User DTO - only expose necessary fields
export type UserDTO = {
  id: string
  name: string
  email: string
  role: string
}

// Login schema for validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Signup schema for validation
export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Create a session token
export async function createSessionToken(user: UserDTO): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET)

  return token
}

// Verify a session token
export async function verifySessionToken(token: string): Promise<UserDTO | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.user as UserDTO
  } catch (error) {
    return null
  }
}

// Get the current session
export async function getSession(): Promise<UserDTO | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  return verifySessionToken(token)
}

// Check if the user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return !!session
}

// Require authentication - redirect to login if not authenticated
export async function requireAuth() {
  const isAuthed = await isAuthenticated()

  if (!isAuthed) {
    redirect("/login")
  }
}

// Convert a User to UserDTO
export function userToDTO(user: User): UserDTO {
  return {
    id: user._id?.toString() || "",
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

// Login a user
export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: UserDTO; error?: string }> {
  try {
    const db = await getDb()
    const user = await db.collection<User>("users").findOne({ email })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    return { success: true, user: userToDTO(user) }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Register a new user
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; user?: UserDTO; error?: string }> {
  try {
    const db = await getDb()

    // Check if user already exists
    const existingUser = await db.collection<User>("users").findOne({ email })

    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser: Omit<User, "_id"> = {
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<User>("users").insertOne(newUser as User)

    if (!result.insertedId) {
      return { success: false, error: "Failed to create user" }
    }

    const createdUser: User = {
      ...newUser,
      _id: result.insertedId,
    }

    return { success: true, user: userToDTO(createdUser) }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Logout a user
export async function logoutUser() {
  const cookiestore = await cookies()
  cookiestore.delete("session")
}

