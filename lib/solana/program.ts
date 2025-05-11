import { Connection, PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import { Program, AnchorProvider, type Idl } from "@project-serum/anchor"
import idl from "./cpop_merkle.json"

// Program ID from the deployed contract
export const PROGRAM_ID = new PublicKey("Br94deSSULwSGwekP5FsuZqYKfWxBajJmz7t7m5kQusz")

// RPC URL for Solana devnet
export const RPC_URL = "https://devnet.helius-rpc.com/?api-key=247e8191-9ef3-4d0f-82f9-cfd98d52182b"

// Create a connection to the Solana cluster
export const getConnection = () => {
  return new Connection(RPC_URL, "confirmed")
}

// Get the program instance
export const getProgram = (wallet: any) => {
  const connection = getConnection()

  // Create a provider with the wallet and connection
  const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" })

  // Create the program instance
  return new Program(idl as Idl, PROGRAM_ID, provider)
}

// Initialize an event with a merkle root
export const initializeEvent = async (
  wallet: any,
  merkleRoot: Uint8Array,
): Promise<{ eventPublicKey: PublicKey; signature: string }> => {
  const program = getProgram(wallet)

  // Create a new keypair for the event account
  const eventKeypair = Keypair.generate()

  try {
    // Call the initializeEvent instruction
    const signature = await program.methods
      .initializeEvent(Array.from(merkleRoot))
      .accounts({
        event: eventKeypair.publicKey,
        organizer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([eventKeypair])
      .rpc()

    return {
      eventPublicKey: eventKeypair.publicKey,
      signature,
    }
  } catch (error) {
    console.error("Error initializing event:", error)
    throw error
  }
}

// Find the PDA for claim data
export const findClaimDataPDA = async (
  eventPublicKey: PublicKey,
  userPublicKey: PublicKey,
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [eventPublicKey.toBuffer(), userPublicKey.toBuffer(), Buffer.from("claim")],
    PROGRAM_ID,
  )
}

// Claim a token using a merkle proof
export const claimToken = async (
  wallet: any,
  eventPublicKey: PublicKey,
  proof: Uint8Array[],
  leaf: Uint8Array,
): Promise<{ signature: string }> => {
  const program = getProgram(wallet)

  // Find the PDA for claim data
  const [claimDataPDA] = await findClaimDataPDA(eventPublicKey, wallet.publicKey)

  try {
    // Call the claim instruction
    const signature = await program.methods
      .claim(
        proof.map((p) => Array.from(p)),
        Array.from(leaf),
      )
      .accounts({
        event: eventPublicKey,
        claimData: claimDataPDA,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc()

    return { signature }
  } catch (error) {
    console.error("Error claiming token:", error)
    throw error
  }
}

// Verify if a token has been claimed
export const verifyTokenClaimed = async (wallet: any, eventPublicKey: PublicKey): Promise<boolean> => {
  const program = getProgram(wallet)

  // Find the PDA for claim data
  const [claimDataPDA] = await findClaimDataPDA(eventPublicKey, wallet.publicKey)

  try {
    // Fetch the claim data account
    const claimData = await program.account.claimData.fetch(claimDataPDA)
    return claimData.claimed
  } catch (error) {
    // If the account doesn't exist, the token hasn't been claimed
    return false
  }
}

// Get all events created by an organizer
export const getOrganizerEvents = async (wallet: any, organizerPublicKey: PublicKey): Promise<any[]> => {
  const program = getProgram(wallet)

  try {
    // Fetch all event accounts where the organizer matches
    const events = await program.account.event.all([
      {
        memcmp: {
          offset: 32, // offset for organizer field (after merkleRoot)
          bytes: organizerPublicKey.toBase58(),
        },
      },
    ])

    return events
  } catch (error) {
    console.error("Error fetching organizer events:", error)
    return []
  }
}
