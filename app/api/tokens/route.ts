import { type NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { TokenService } from "@/lib/solana/tokenService"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const wallet = searchParams.get("wallet")

    if (!wallet) {
      return NextResponse.json({ error: "Missing wallet parameter" }, { status: 400 })
    }

    // Get user tokens
    const tokens = await TokenService.getUserTokens(new PublicKey(wallet))

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error("Error getting tokens:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
