"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Navigation from "@/components/Navigation"
import AnimatedBackground from "@/components/AnimatedBackground"
import { TokenService } from "@/lib/solana/tokenService"
import { createUsernameTransaction, getUsernameByWallet, storeUsernameLocally } from "@/utils/solana"
import { TicketIcon, UserIcon } from "@heroicons/react/24/outline"

export default function ProfilePage() {
  const { publicKey, connected, signTransaction } = useWallet()
  const [username, setUsername] = useState<string | null>(null)
  const [newUsername, setNewUsername] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [userTokens, setUserTokens] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (connected && publicKey) {
        setIsLoading(true)
        try {
          // Fetch username
          const name = await getUsernameByWallet(publicKey)
          setUsername(name)

          // Fetch tokens
          const tokens = await TokenService.getUserTokens(publicKey)
          setUserTokens(tokens)
        } catch (error) {
          console.error("Error fetching profile data:", error)
          toast.error("Failed to load profile data")
        } finally {
          setIsLoading(false)
        }
      } else {
        setUsername(null)
        setUserTokens([])
        setIsLoading(false)
      }
    }

    fetchData()
  }, [connected, publicKey])

  const handleRegisterUsername = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!newUsername) {
      toast.error("Please enter a username")
      return
    }

    setIsRegistering(true)
    try {
      // Create transaction for username registration
      const transaction = await createUsernameTransaction(publicKey, newUsername)

      // Sign the transaction
      const signedTx = await signTransaction(transaction)

      // In a real app, you would send this transaction to the network
      // For demo purposes, we'll just store it locally
      storeUsernameLocally(publicKey, newUsername)

      // Update state
      setUsername(newUsername)
      setNewUsername("")

      toast.success("Username registered successfully")
    } catch (error) {
      console.error("Error registering username:", error)
      toast.error("Failed to register username")
    } finally {
      setIsRegistering(false)
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen">
        <AnimatedBackground />
        <Navigation />

        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-md mx-auto glass-card neon-border rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 glow-text">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">Please connect your wallet to view your profile and tokens</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 glow-text-pink text-center">Your Profile</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Profile Info */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card neon-border rounded-xl p-6 h-full"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-neon-pink/20 flex items-center justify-center mb-4">
                  <UserIcon className="h-12 w-12 text-neon-pink" />
                </div>

                {username ? (
                  <h2 className="text-xl font-bold glow-text-pink">@{username}</h2>
                ) : (
                  <h2 className="text-xl font-bold text-gray-400">No Username</h2>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Wallet Address</h3>
                <div className="bg-white/5 rounded-lg p-3 break-all font-mono text-sm">{publicKey.toString()}</div>
              </div>

              {!username && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Register Username</h3>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-pink/50 mb-4"
                  />

                  <button
                    onClick={handleRegisterUsername}
                    disabled={isRegistering}
                    className="w-full py-2 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/50 rounded-lg text-white transition-colors"
                  >
                    {isRegistering ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registering...
                      </span>
                    ) : (
                      "Register Username"
                    )}
                  </button>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Account Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Username</span>
                    <span className="text-white">{username || "Not registered"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tokens</span>
                    <span className="text-white">{userTokens.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tokens */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card neon-border rounded-xl p-6 h-full"
            >
              <h2 className="text-xl font-bold mb-6 glow-text">Your Tokens</h2>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userTokens.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userTokens.map((token, index) => (
                    <motion.div
                      key={token.tokenAddress}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                          <TicketIcon className="h-6 w-6 text-neon-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{token.metadata.name}</h3>
                          <p className="text-sm text-gray-400">{token.metadata.symbol}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-6">You don't have any tokens yet</p>
                  <button
                    onClick={() => (window.location.href = "/claim")}
                    className="px-6 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg text-white transition-colors"
                  >
                    Claim Your First Token
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
