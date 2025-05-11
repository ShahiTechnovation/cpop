"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"

import Navigation from "@/components/Navigation"
const AnimatedBackground = dynamic(() => import("@/components/AnimatedBackground"), { ssr: false })
import QRCode from "qrcode.react"

import { TokenService, type TokenMetadata } from "@/lib/solana/tokenService"

export default function MintPage() {
  const { publicKey, connected } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [mintForm, setMintForm] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    description: "",
    image: "",
  })

  const [isMinting, setIsMinting] = useState(false)
  const [mintedToken, setMintedToken] = useState<any>(null)
  const [qrData, setQrData] = useState("")

  if (!isClient) return null

  const handleMintToken = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet")
      return
    }

    if (!mintForm.name || !mintForm.symbol || !mintForm.description || !mintForm.image) {
      toast.error("Fill in all required fields")
      return
    }

    setIsMinting(true)
    try {
      const result = await retryWithDelay(
        () => TokenService.mintToken(publicKey, publicKey, mintForm),
        3, // Retry up to 3 times
        1000 // 1-second delay between retries
      );

      if (!result.success) throw new Error(result.error);

      const tokenAddress = result.tokenAddress;
      const eventId = "event_" + Math.random().toString(36).substring(2, 10);
      const ownerAddress = publicKey.toBase58();
      const qr = TokenService.generateQRData(tokenAddress, eventId, ownerAddress);

      setQrData(qr)
      setMintedToken({ tokenAddress, metadata: mintForm, eventId })
      toast.success("Token minted successfully")
    } catch (error) {
      console.error("Mint error:", error)
      toast.error("Minting failed")
    } finally {
      setIsMinting(false)
    }
  }

  // Retry function with delay
  async function retryWithDelay(fn: () => Promise<any>, retries: number, delayMs: number) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(`Retrying... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 glow-text text-center">Mint cToken</h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-10">
            Create ZK-compressed proof-of-participation tokens for your events
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {mintedToken ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card neon-border rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4 glow-text text-center">Token Minted Successfully</h2>
              <p className="text-gray-300 text-center mb-6">Share this QR code with attendees</p>

              <div className="flex flex-col items-center">
                <div className="bg-white/10 p-4 rounded-xl mb-6">
                  <QRCode value={qrData} size={250} renderAs="svg" />
                </div>

                <h3 className="text-xl font-semibold mb-2 glow-text-purple">{mintedToken.metadata.name}</h3>
                <p className="text-gray-300">{mintedToken.metadata.description}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Token Address: {mintedToken.tokenAddress.slice(0, 8)}...{mintedToken.tokenAddress.slice(-8)}
                </p>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setMintedToken(null)}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition"
                  >
                    Mint Another
                  </button>
                  <button
                    onClick={() => toast.success("QR code downloaded")}
                    className="px-6 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg text-white transition"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card neon-border rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4 glow-text">Create New Token</h2>
              <p className="text-gray-300 mb-6">Fill in the details for your cPOP token</p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Token Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Solana Hackathon"
                      value={mintForm.name}
                      onChange={(e) => setMintForm({ ...mintForm, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-neon-blue/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Token Symbol</label>
                    <input
                      type="text"
                      placeholder="e.g., HACK23"
                      value={mintForm.symbol}
                      onChange={(e) => setMintForm({ ...mintForm, symbol: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-neon-blue/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="What is this token for?"
                    value={mintForm.description}
                    onChange={(e) => setMintForm({ ...mintForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-neon-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.png"
                    value={mintForm.image}
                    onChange={(e) => setMintForm({ ...mintForm, image: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-neon-blue/50"
                  />
                </div>

                <button
                  onClick={handleMintToken}
                  disabled={isMinting || !connected}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                    connected
                      ? "bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple"
                      : "bg-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isMinting ? "Minting..." : "Mint Token"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

declare module "qrcode.react" {
  import * as React from "react";

  export interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
    renderAs?: "canvas" | "svg";
    includeMargin?: boolean;
    imageSettings?: {
      src: string;
      x?: number;
      y?: number;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
  }

  const QRCode: React.FC<QRCodeProps>;
  export default QRCode;
}
