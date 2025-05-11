"use client"
import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import AnimatedBackground from "@/components/AnimatedBackground"
import FeatureCard from "@/components/FeatureCard"
import { QrCodeIcon, TicketIcon, UserIcon, GlobeAltIcon } from "@heroicons/react/24/outline"

export default function Home() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-aurora-gradient bg-clip-text text-transparent bg-[length:200%_auto] animate-aurora-shift">
              cPOP Pass
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Mint and claim ZK-compressed Proof-of-Participation NFTs on Solana
            </p>
          </motion.div>

          {/* Logo Animation */}
          <motion.div
            className="my-12 relative h-40 w-40 mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-neon-blue/20 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 243, 255, 0.5)",
                  "0 0 40px rgba(0, 243, 255, 0.8)",
                  "0 0 20px rgba(0, 243, 255, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute inset-4 rounded-full bg-neon-purple/20 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(157, 0, 255, 0.5)",
                  "0 0 40px rgba(157, 0, 255, 0.8)",
                  "0 0 20px rgba(157, 0, 255, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            />
            <motion.div
              className="absolute inset-8 rounded-full bg-neon-pink/20 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255, 0, 245, 0.5)",
                  "0 0 40px rgba(255, 0, 245, 0.8)",
                  "0 0 20px rgba(255, 0, 245, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />
            <motion.div
              className="absolute inset-12 rounded-full bg-neon-green/20 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 255, 102, 0.5)",
                  "0 0 40px rgba(0, 255, 102, 0.8)",
                  "0 0 20px rgba(0, 255, 102, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-b from-neon-blue to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-t from-neon-purple to-transparent" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent to-neon-pink" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-gradient-to-l from-transparent to-neon-green" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Mint cTokens"
            description="Create ZK-compressed proof-of-participation tokens for your events"
            icon={<TicketIcon className="h-10 w-10" />}
            href="/mint"
            color="blue"
            delay={0.1}
          />
          <FeatureCard
            title="Scan QR to Claim"
            description="Scan QR codes to claim your proof-of-participation tokens"
            icon={<QrCodeIcon className="h-10 w-10" />}
            href="/claim"
            color="purple"
            delay={0.2}
          />
          <FeatureCard
            title="Register Username"
            description="Register your on-chain username linked to your wallet"
            icon={<UserIcon className="h-10 w-10" />}
            href="/profile"
            color="pink"
            delay={0.3}
          />
          <FeatureCard
            title="Explore Events"
            description="Discover events and collect proof-of-participation tokens"
            icon={<GlobeAltIcon className="h-10 w-10" />}
            href="/events"
            color="green"
            delay={0.4}
          />
        </section>

        {/* Info Section */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-4 glow-text">What is cPOP Pass?</h2>
            <p className="text-gray-300 mb-4">
              cPOP Pass is a platform for creating and claiming ZK-compressed Proof-of-Participation NFTs on Solana.
              These tokens serve as verifiable proof that you attended or participated in an event.
            </p>
            <p className="text-gray-300 mb-4">
              Using Light Protocol's ZK compression technology, cPOP Pass makes it possible to mint and distribute
              tokens with near-zero gas fees, making it accessible for events of any size.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold mb-2 text-neon-blue">For Event Organizers</h3>
                <p className="text-gray-400 text-sm">
                  Create and distribute proof-of-participation tokens for your events with minimal cost.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold mb-2 text-neon-purple">For Attendees</h3>
                <p className="text-gray-400 text-sm">
                  Collect verifiable proof of your participation in events and showcase your involvement.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold mb-2 text-neon-green">For Communities</h3>
                <p className="text-gray-400 text-sm">
                  Build stronger communities by recognizing and rewarding participation and engagement.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} cPOP Pass. Built on Solana with Light Protocol.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
