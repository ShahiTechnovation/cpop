import type { PublicKey } from "@solana/web3.js"

// Mock data for demonstration purposes
const MOCK_TOKENS = [
  {
    tokenAddress: "token123",
    metadata: {
      name: "ETH Global Hackathon",
      symbol: "ETHG",
      description: "Proof of participation in ETH Global Hackathon",
      image: "https://example.com/image.png",
    },
    amount: 1,
  },
  {
    tokenAddress: "token456",
    metadata: {
      name: "Solana Summer Hack",
      symbol: "SOLH",
      description: "Participated in Solana Summer Hackathon",
      image: "https://example.com/solana.png",
    },
    amount: 1,
  },
]

export interface TokenMetadata {
  name: string
  symbol: string
  description: string
  image: string
  attributes?: Array<{ trait_type: string; value: string }>
  external_url?: string
}

export interface EventDetails {
  id: string
  name: string
  description: string
  date: string
  location: string
  organizer: string
  image?: string
}

export class TokenService {
  static async mintToken(wallet: PublicKey, recipient: PublicKey, metadata: TokenMetadata, amount = 1) {
    try {
      // This is a simplified mock implementation
      // In a real app, this would use the Light Protocol SDK
      console.log("Minting token with metadata:", metadata)
      console.log("Recipient:", recipient.toString())

      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const tokenAddress = "token_" + Math.random().toString(36).substring(2, 15)

      return {
        success: true,
        tokenAddress,
        signature: "sim_" + Math.random().toString(36).substring(2, 15),
      }
    } catch (error) {
      console.error("Error minting token:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  static async claimToken(qrData: string, wallet: PublicKey) {
    try {
      // Parse QR data to get token info
      const tokenData = JSON.parse(qrData)
      const { tokenAddress, eventId } = tokenData

      console.log("Claiming token:", tokenAddress)
      console.log("Event ID:", eventId)

      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        signature: "sim_" + Math.random().toString(36).substring(2, 15),
        eventId,
      }
    } catch (error) {
      console.error("Error claiming token:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  static async getUserTokens(wallet: PublicKey) {
    try {
      console.log("Getting tokens for wallet:", wallet.toString())

      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Return mock data
      return MOCK_TOKENS
    } catch (error) {
      console.error("Error getting user tokens:", error)
      return []
    }
  }

  static async getEventDetails(eventId: string): Promise<EventDetails | null> {
    // Mock implementation
    return {
      id: eventId,
      name: "Solana Hackathon 2023",
      description: "A hackathon for Solana developers",
      date: "2023-12-01",
      location: "Virtual",
      organizer: "Solana Foundation",
      image: "https://example.com/image.png",
    }
  }

  static generateQRData(tokenAddress: string, eventId: string, owner: string) {
    // Create QR data
    const qrData = JSON.stringify({
      tokenAddress,
      eventId,
      owner,
      proofData: "mock_proof_data_" + Math.random().toString(36).substring(2, 10),
    })

    return qrData
  }
}
