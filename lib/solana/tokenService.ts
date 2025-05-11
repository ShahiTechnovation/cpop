import type { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey, Signer, TransactionSignature } from "@solana/web3.js";
import { createMint, mintTo } from "@lightprotocol/compressed-token";
import { createRpc, confirmTx } from "@lightprotocol/stateless.js";
import type { WalletAdapter } from "@solana/wallet-adapter-base";

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  external_url?: string;
}

export class TokenService {
  static async mintToken(wallet: WalletAdapter, recipient: PublicKey, metadata: TokenMetadata) {
    try {
      // Ensure the wallet and publicKey are valid
      if (!wallet || !wallet.publicKey) {
        throw new Error("Wallet is not connected or publicKey is missing");
      }

      const rpcUrl =
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

      const connection = createRpc(rpcUrl);
      const payer = wallet.adapter;

      // Retry logic for rate-limited requests
      const result = await retryWithDelay(
        () => createMint(connection, payer, wallet.publicKey, 0),
        3, // Retry up to 3 times
        1000 // 1-second delay between retries
      );

      const { mint } = result;

      // Mint tokens to the recipient
      await mintTo(connection, payer, mint, recipient, wallet.publicKey, 1);

      return {
        success: true,
        tokenAddress: mint.toBase58(),
        signature: "minted_with_connected_wallet",
      };
    } catch (error) {
      console.error("Mint error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async claimToken(qrData: string, wallet: PublicKey) {
    try {
      const tokenData = JSON.parse(qrData);
      const { tokenAddress, eventId } = tokenData;

      console.log("Claiming token:", tokenAddress);
      console.log("Event ID:", eventId);

      // Simulate delay or actual transaction here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        eventId,
        signature: "mock_signature_" + Math.random().toString(36).substring(2, 10),
      };
    } catch (err) {
      console.error("Error claiming token", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  static generateQRData(tokenAddress: string, eventId: string, owner: string) {
    return JSON.stringify({
      tokenAddress,
      eventId,
      owner,
      proofData: "mock_" + Math.random().toString(36).substring(2, 10),
    });
  }

  static getEventDetails(eventId: any) {
    throw new Error("Method not implemented.");
  }

  static getUserTokens(_pubkey: PublicKey) {
    throw new Error("Method not implemented.");
  }
}

// Retry logic with delay
async function retryWithDelay(
  action: () => Promise<{ mint: PublicKey; transactionSignature: TransactionSignature }>,
  retries: number,
  delay: number
): Promise<{ mint: PublicKey; transactionSignature: TransactionSignature }> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      console.warn(`Retrying... (${attempt + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Retry attempts exceeded");
}

