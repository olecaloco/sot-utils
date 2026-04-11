import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = await adminAuth.createCustomToken(userId)

  return NextResponse.json({ token })
}