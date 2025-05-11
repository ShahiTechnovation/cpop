"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Navigation from "@/components/Navigation"
import AnimatedBackground from "@/components/AnimatedBackground"
import { QRScanner } from "@/components/QRScanner"
import { TokenService } from "@/lib/solana/tokenService" // corrected path
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"

type ClaimStep = "scan" | "processing" | "success" | "error"

export default function ClaimPage() {
  const { publicKey, connected } = useWallet()
  const [step, setStep] = useState<ClaimStep>("scan")
  const [scanData, setScanData] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [claimedToken, setClaimedToken] = useState<any>(null)
  const [manualCode, setManualCode] = useState("")

  const handleScan = async (data: string) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet to claim tokens")
      return
    }

    setScanData(data)
    setStep("processing")

    try {
      const parsedData = JSON.parse(data)
      const result = await TokenService.claimToken(parsedData, publicKey)

      if (result.success) {
        const eventDetails = await TokenService.getEventDetails(result.eventId)

        setClaimedToken({
          ...result,
          eventDetails,
        })

        setStep("success")
        toast.success("Token claimed successfully!")
      } else {
        setClaimError(result.error || "Failed to claim token")
        setStep("error")
        toast.error("Failed to claim token")
      }
    } catch (error) {
      console.error("Error claiming token:", error)
      setClaimError(error instanceof Error ? error.message : "Unknown error occurred")
      setStep("error")
      toast.error("Failed to claim token")
    }
  }

  const handleManualClaim = async () => {
    if (!manualCode.trim()) {
      toast.error("Please enter a claim code")
      return
    }

    try {
      JSON.parse(manualCode.trim()) // Ensure it's valid JSON
      handleScan(manualCode.trim())
    } catch (error) {
      toast.error("Invalid code format")
    }
  }

  const resetClaim = () => {
    setStep("scan")
    setScanData(null)
    setClaimError(null)
    setClaimedToken(null)
    setManualCode("")
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 glow-text-purple text-center">Claim cToken</h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-10">
            Scan a QR code to claim your proof-of-participation token
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          {step === "scan" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card neon-border rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 glow-text-purple text-center">Scan QR Code</h2>
              <QRScanner onScan={handleScan} onClose={() => {}} />
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark-blue text-gray-400">Or enter code manually</span>
                  </div>
                </div>

                <div className="mt-6">
                  <textarea
                    placeholder='{"tokenAddress":"...","eventId":"..."}'
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50 mb-4"
                  />

                  <button
                    onClick={handleManualClaim}
                    disabled={!connected}
                    className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                      connected
                        ? "bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    {connected ? "Verify & Claim" : "Connect Wallet to Claim"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card neon-border rounded-xl p-8"
            >
              <h2 className="text-xl font-bold mb-4 glow-text text-center">Processing Claim</h2>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-gray-300 text-center">Verifying token data and processing your claim...</p>
              </div>
            </motion.div>
          )}

          {step === "success" && claimedToken && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card neon-border rounded-xl p-8"
            >
              <h2 className="text-xl font-bold mb-4 glow-text-green text-center">Token Claimed!</h2>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mb-6">
                  <CheckIcon className="h-10 w-10 text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2 glow-text-green">
                  {claimedToken.eventDetails?.name || "Event Token"}
                </h3>
                <p className="text-gray-300 text-center mb-6">
                  {claimedToken.eventDetails?.description || "Proof of participation token"}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={resetClaim}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={() => (window.location.href = "/profile")}
                    className="px-6 py-2 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/50 rounded-lg text-white transition-colors"
                  >
                    View My Tokens
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card neon-border rounded-xl p-8"
            >
              <h2 className="text-xl font-bold mb-4 text-red-400 text-center">Claim Failed</h2>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                  <XMarkIcon className="h-10 w-10 text-red-400" />
                </div>
                <p className="text-gray-300 text-center mb-6">
                  {claimError || "An unknown error occurred while claiming your token."}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={resetClaim}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
