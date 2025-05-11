"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { getUsernameByWallet } from "@/utils/solana"

export default function Navigation() {
  const { publicKey } = useWallet()
  const pathname = usePathname()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsername = async () => {
      if (publicKey) {
        const name = await getUsernameByWallet(publicKey)
        setUsername(name)
      } else {
        setUsername(null)
      }
    }

    fetchUsername()
  }, [publicKey])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Mint", path: "/mint" },
    { name: "Claim", path: "/claim" },
    { name: "Profile", path: "/profile" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-dark-blue/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                className="text-2xl font-bold glow-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                cPOP Pass
              </motion.div>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    pathname === item.path
                      ? "border-neon-blue text-white glow-text"
                      : "border-transparent text-gray-300 hover:text-white hover:border-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {publicKey && username && (
              <div className="mr-4 text-sm text-gray-300">
                <span className="text-neon-purple glow-text-purple">@{username}</span>
              </div>
            )}
            <WalletMultiButton className="!bg-gradient-to-r !from-neon-purple !to-neon-blue hover:!from-neon-blue hover:!to-neon-purple !transition-all !duration-300 !rounded-lg !py-2 !px-4 !text-white !font-medium" />
          </div>
        </div>
      </div>
    </nav>
  )
}
