import { type NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { claimToken } from "@/lib/solana/program"
import { storeTokenClaimData } from "@/lib/redis/redis-service"
import { hexToUint8Array } from "@/lib/solana/merkle"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, proof, leaf, wallet } = body

    if (!eventId || !proof || !leaf || !wallet) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert event ID to PublicKey
    const eventPublicKey = new PublicKey(eventId)

    // Convert proof and leaf from hex to Uint8Array
    const proofBytes = proof.map((p: string) => hexToUint8Array(p))
    const leafBytes = hexToUint8Array(leaf)

    // Claim token on-chain
    const { signature } = await claimToken(wallet, eventPublicKey, proofBytes, leafBytes)

    // Store claim data in Redis
    await storeTokenClaimData({
      eventId,
      userPublicKey: wallet.publicKey.toString(),
      claimed: true,
      claimedAt: Date.now(),
    })

    return NextResponse.json({
      success: true,
      signature,
    })
  } catch (error) {
    console.error("Error claiming token:", error)
    return NextResponse.json({ error: "Failed to claim token" }, { status: 500 })
  }
}
