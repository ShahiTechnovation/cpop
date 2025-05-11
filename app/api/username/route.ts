import { type NextRequest, NextResponse } from "next/server"
import { checkUsernameRegistered } from "@/utils/solana"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, wallet, signature } = body

    if (!username || !wallet || !signature) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Check if username is already registered
    const isRegistered = await checkUsernameRegistered(username)
    if (isRegistered) {
      return NextResponse.json({ error: "Username already registered" }, { status: 400 })
    }

    // In a real app, this would verify the signature and register the username on-chain

    return NextResponse.json({
      success: true,
      username,
      wallet,
    })
  } catch (error) {
    console.error("Error registering username:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
