import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"

// Initialize connection to Solana network
export const getConnection = () => {
  return new Connection("https://devnet.helius-rpc.com/?api-key=247e8191-9ef3-4d0f-82f9-cfd98d52182b", "confirmed")
}

// Function to create a mock transaction for username registration
// In a real app, this would interact with a custom program
export const createUsernameTransaction = async (wallet: PublicKey, username: string): Promise<Transaction> => {
  const connection = getConnection()

  // Create a transaction that will serve as a record
  // In a real app, this would call your custom program to store the username
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet,
      toPubkey: wallet, // Send to self as a record
      lamports: 5000, // Minimal amount
    }),
  )

  // Add a memo to the transaction with the username
  // This is a simplified approach - in production you'd use a custom program
  const memoInstruction = new Transaction().add({
    keys: [],
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
    data: Buffer.from(`register-username:${username}`),
  })

  transaction.add(memoInstruction)

  // Get the latest blockhash
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = wallet

  return transaction
}

// Function to check if a username is registered
// In a real app, this would query your custom program
export const checkUsernameRegistered = async (username: string): Promise<boolean> => {
  // This is a mock implementation
  // In a real app, you would query your custom program or an indexer
  return false
}

// Function to get a user's registered username
// In a real app, this would query your custom program
export const getUsernameByWallet = async (wallet: PublicKey): Promise<string | null> => {
  // This is a mock implementation
  // In a real app, you would query your custom program or an indexer

  // For demo purposes, we'll check localStorage if available
  if (typeof window !== "undefined") {
    const storedUsername = localStorage.getItem(`cpop-username-${wallet.toString()}`)
    if (storedUsername) {
      return storedUsername
    }
  }

  return null
}

// Function to store username locally (for demo purposes)
export const storeUsernameLocally = (wallet: PublicKey, username: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`cpop-username-${wallet.toString()}`, username)
  }
}
