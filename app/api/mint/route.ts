import { type NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { TokenService, type TokenMetadata } from "@/utils/tokenService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet, recipient, metadata } = body

    if (!wallet || !recipient || !metadata) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Convert string to PublicKey
    const recipientPubkey = new PublicKey(recipient)

    // Mint token
    const result = await TokenService.mintToken(new PublicKey(wallet), recipientPubkey, metadata as TokenMetadata)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to mint token" }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error minting token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
