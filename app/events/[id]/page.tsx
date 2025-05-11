"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Navigation from "@/components/Navigation"
import AnimatedBackground from "@/components/AnimatedBackground"
import { QRCode } from "@/components/QRCode"
import { TokenService, type TokenMetadata } from "@/utils/tokenService"
import { CalendarIcon, MapPinIcon, UserGroupIcon, TicketIcon } from "@heroicons/react/24/outline"

// Mock data for events
const events = [
  {
    id: "1",
    name: "Solana Hackathon 2023",
    description:
      "Join the biggest Solana hackathon of the year and build the future of web3. This multi-day event brings together developers, designers, and entrepreneurs to build innovative projects on the Solana blockchain. Participants will have the opportunity to win prizes, receive mentorship, and showcase their projects to the community.",
    date: "2023-12-01",
    location: "Virtual",
    attendees: 1200,
    image: "https://via.placeholder.com/800x400/0a0a20/00f3ff?text=Solana+Hackathon",
    organizer: "Solana Foundation",
  },
  {
    id: "2",
    name: "DeFi Summit",
    description:
      "Explore the latest innovations in decentralized finance on Solana. This summit brings together leading DeFi projects, investors, and enthusiasts to discuss the future of finance on Solana. Topics include lending protocols, DEXs, yield farming, and more.",
    date: "2023-11-15",
    location: "New York, NY",
    attendees: 500,
    image: "https://via.placeholder.com/800x400/0a0a20/9d00ff?text=DeFi+Summit",
    organizer: "Solana Ventures",
  },
  {
    id: "3",
    name: "NFT Gallery Opening",
    description:
      "Exclusive gallery opening featuring compressed NFTs on Solana. This event showcases the work of digital artists using Solana's compressed NFT technology. Attendees will have the opportunity to view and purchase unique digital art pieces.",
    date: "2023-12-10",
    location: "Los Angeles, CA",
    attendees: 300,
    image: "https://via.placeholder.com/800x400/0a0a20/ff00f5?text=NFT+Gallery",
    organizer: "Metaplex Foundation",
  },
  {
    id: "4",
    name: "Web3 Gaming Conference",
    description:
      "The intersection of gaming and blockchain technology. This conference explores how blockchain technology is transforming the gaming industry. Topics include play-to-earn models, in-game assets, and the future of gaming on Solana.",
    date: "2024-01-20",
    location: "San Francisco, CA",
    attendees: 800,
    image: "https://via.placeholder.com/800x400/0a0a20/00ff66?text=Web3+Gaming",
    organizer: "Solana Gaming Collective",
  },
]

export default function EventPage() {
  const params = useParams()
  const eventId = params.id as string
  const { publicKey, connected } = useWallet()
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMinting, setIsMinting] = useState(false)
  const [mintedToken, setMintedToken] = useState<any>(null)
  const [qrData, setQrData] = useState("")

  useEffect(() => {
    // Fetch event data
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        const foundEvent = events.find((e) => e.id === eventId)
        if (foundEvent) {
          setEvent(foundEvent)
        }
      } catch (error) {
        console.error("Error fetching event:", error)
        toast.error("Failed to load event data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  const handleMintToken = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!event) {
      toast.error("Event data not available")
      return
    }

    setIsMinting(true)
    try {
      // Create token metadata
      const metadata: TokenMetadata = {
        name: `${event.name} - POP`,
        symbol: `POP${event.id}`,
        description: `Proof of participation for ${event.name}`,
        image: event.image,
      }

      // For demo purposes, we'll simulate minting
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const tokenAddress = "simulated_token_address_" + Math.random().toString(36).substring(2, 15)

      // Generate QR code data
      const qrData = TokenService.generateQRData(tokenAddress, event.id, publicKey.toString())

      setQrData(qrData)
      setMintedToken({
        tokenAddress,
        metadata,
        eventId: event.id,
      })

      toast.success("Token minted successfully")
    } catch (error) {
      console.error("Error minting token:", error)
      toast.error("Failed to mint token")
    } finally {
      setIsMinting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <AnimatedBackground />
        <Navigation />

        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen">
        <AnimatedBackground />
        <Navigation />

        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-md mx-auto glass-card neon-border rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Event Not Found</h2>
            <p className="text-gray-300 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => (window.location.href = "/events")}
              className="px-6 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg text-white transition-colors"
            >
              Back to Events
            </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card neon-border rounded-xl overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-bold mb-4 glow-text-green">{event.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <CalendarIcon className="h-5 w-5 mr-2 text-neon-green" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPinIcon className="h-5 w-5 mr-2 text-neon-green" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-neon-green" />
                    {event.attendees} attendees
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-white">Description</h2>
                  <p className="text-gray-300">{event.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-white">Organizer</h2>
                  <p className="text-gray-300">{event.organizer}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Token Minting */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card neon-border rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 glow-text">Event Dashboard</h2>

              {mintedToken ? (
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4 text-center glow-text-green">Token Minted Successfully</h3>

                  <div className="bg-white/10 p-4 rounded-xl mb-6">
                    <QRCode data={qrData} size={200} />
                  </div>

                  <p className="text-gray-300 text-center mb-6">
                    Share this QR code with attendees to claim their proof-of-participation token
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setMintedToken(null)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                    >
                      Mint Another
                    </button>
                    <button
                      onClick={() => {
                        // In a real app, this would download the QR code
                        toast.success("QR code downloaded")
                      }}
                      className="px-4 py-2 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/50 rounded-lg text-white transition-colors"
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 mb-6">
                    As an event organizer, you can mint proof-of-participation tokens for attendees.
                  </p>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <TicketIcon className="h-5 w-5 mr-2 text-neon-green" />
                      Mint cTokens
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Create ZK-compressed proof-of-participation tokens for this event
                    </p>
                    <button
                      onClick={handleMintToken}
                      disabled={isMinting || !connected}
                      className={`w-full py-2 rounded-lg text-white font-medium transition-all ${
                        connected
                          ? "bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-green"
                          : "bg-gray-700 cursor-not-allowed"
                      }`}
                    >
                      {isMinting ? (
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
                          Minting...
                        </span>
                      ) : connected ? (
                        "Mint Event Tokens"
                      ) : (
                        "Connect Wallet to Mint"
                      )}
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2">Event Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Date</span>
                        <span className="text-white">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Location</span>
                        <span className="text-white">{event.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Attendees</span>
                        <span className="text-white">{event.attendees}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Tokens Claimed</span>
                        <span className="text-white">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
