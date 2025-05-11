import { type NextRequest, NextResponse } from "next/server"
import { initializeEvent } from "@/lib/solana/program"
import { storeEventData } from "@/lib/redis/redis-service"
import { hexToUint8Array } from "@/lib/solana/merkle"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, imageUri, merkleRoot, wallet } = body

    if (!name || !description || !merkleRoot || !wallet) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert merkle root from hex to Uint8Array
    const merkleRootBytes = hexToUint8Array(merkleRoot)

    // Initialize event on-chain
    const { eventPublicKey, signature } = await initializeEvent(wallet, merkleRootBytes)

    // Store event data in Redis
    await storeEventData({
      id: eventPublicKey.toString(),
      name,
      description,
      imageUri: imageUri || "",
      merkleRoot,
      organizerPublicKey: wallet.publicKey.toString(),
      createdAt: Date.now(),
      attendees: [],
    })

    return NextResponse.json({
      success: true,
      eventId: eventPublicKey.toString(),
      signature,
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Implement get events logic here
  return NextResponse.json({ message: "Not implemented yet" })
}
