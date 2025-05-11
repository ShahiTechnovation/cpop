"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"

type WalletContextType = {
  connected: boolean
  publicKey: PublicKey | null
  connecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  signMessage: (message: string) => Promise<Uint8Array | null>
  username: string | null
  setUsername: (username: string) => void
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signMessage: async () => null,
  username: null,
  setUsername: () => {},
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined" && "phantom" in window) {
        try {
          const phantom = (window as any).phantom?.solana

          if (phantom?.isPhantom) {
            try {
              const response = await phantom.connect({ onlyIfTrusted: true })
              const key = new PublicKey(response.publicKey.toString())
              setPublicKey(key)
              setConnected(true)

              // Check for username in localStorage
              const storedUsername = localStorage.getItem(`ctoken-username-${key.toString()}`)
              if (storedUsername) {
                setUsername(storedUsername)
              }
            } catch (error) {
              // User has not connected before or has revoked access
              console.log("Not previously connected")
            }
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkWalletConnection()
  }, [])

  const connectWallet = async () => {
    if (typeof window !== "undefined") {
      try {
        setConnecting(true)

        // For demo purposes in Next.js, create a mock wallet connection
        if (process.env.NODE_ENV === "development" || !("phantom" in window)) {
          // Create a mock public key for testing
          const mockKey = new PublicKey("4Zw5rJu4VYQFxG8uXhxwr6amJFZWHFzXYBwoXYmr1bogBHD3")
          setPublicKey(mockKey)
          setConnected(true)

          toast({
            title: "Demo wallet connected",
            description: "Using a mock wallet for demonstration",
          })

          return
        }

        const phantom = (window as any).phantom?.solana

        if (!phantom) {
          toast({
            title: "Wallet not found",
            description: "Please install Phantom or another Solana wallet",
            variant: "destructive",
          })
          return
        }

        const response = await phantom.connect()
        const key = new PublicKey(response.publicKey.toString())
        setPublicKey(key)
        setConnected(true)

        // Check for username in localStorage
        const storedUsername = localStorage.getItem(`ctoken-username-${key.toString()}`)
        if (storedUsername) {
          setUsername(storedUsername)
        }

        toast({
          title: "Wallet connected",
          description: "Your wallet has been connected successfully",
        })
      } catch (error) {
        console.error("Error connecting wallet:", error)
        toast({
          title: "Connection failed",
          description: "Failed to connect wallet",
          variant: "destructive",
        })
      } finally {
        setConnecting(false)
      }
    } else {
      toast({
        title: "Wallet not found",
        description: "Please install Phantom or another Solana wallet",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    if (typeof window !== "undefined" && "phantom" in window) {
      const phantom = (window as any).phantom?.solana
      if (phantom?.isPhantom) {
        phantom.disconnect()
      }
    }

    setConnected(false)
    setPublicKey(null)
    setUsername(null)

    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const signMessage = async (message: string): Promise<Uint8Array | null> => {
    if (!connected || !publicKey) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return null
    }

    try {
      // For demo purposes in Next.js
      if (process.env.NODE_ENV === "development" || !("phantom" in window)) {
        // Create a mock signature
        return new Uint8Array(Array.from({ length: 64 }, () => Math.floor(Math.random() * 256)))
      }

      const encodedMessage = new TextEncoder().encode(message)
      const phantom = (window as any).phantom?.solana
      const { signature } = await phantom.signMessage(encodedMessage, "utf8")
      return signature
    } catch (error) {
      console.error("Error signing message:", error)
      toast({
        title: "Signing failed",
        description: "Failed to sign message with wallet",
        variant: "destructive",
      })
      return null
    }
  }

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername)
    if (publicKey) {
      localStorage.setItem(`ctoken-username-${publicKey.toString()}`, newUsername)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        connecting,
        connectWallet,
        disconnectWallet,
        signMessage,
        username,
        setUsername: updateUsername,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
