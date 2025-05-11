"use client"

import { useState, useEffect } from "react"
import { QrReader } from "react-qr-reader"
import { motion } from "framer-motion"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check for camera permissions
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          setHasPermission(true)
        })
        .catch((err) => {
          console.error("Camera permission error:", err)
          setHasPermission(false)
          setError("Camera permission denied. Please allow camera access to scan QR codes.")
        })
    } else {
      setHasPermission(false)
      setError("Camera not available on this device or browser.")
    }

    return () => {
      setIsMounted(false)
    }
  }, [])

  const handleScan = (result: any) => {
    if (result) {
      try {
        // Validate that the QR code contains valid token data
        const data = result?.text
        if (!data) return

        // Try to parse the data as JSON to validate it's a token QR
        const parsedData = JSON.parse(data)
        if (!parsedData.tokenAddress || !parsedData.eventId) {
          throw new Error("Invalid QR code format")
        }

        // Success - pass the data to the parent component
        onScan(data)
      } catch (err) {
        console.error("Invalid QR code:", err)
        setError("Invalid QR code format. Please scan a valid cPOP Pass QR code.")
      }
    }
  }

  if (!isMounted) {
    return null // Prevent hydration errors
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {error ? (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      ) : hasPermission === false ? (
        <div className="glass-card rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-4 glow-text">Camera Access Required</h3>
          <p className="text-gray-300 mb-6">Please allow camera access in your browser settings to scan QR codes.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={handleScan}
            scanDelay={500}
            className="w-full aspect-square rounded-xl overflow-hidden"
            videoStyle={{ objectFit: "cover" }}
            videoContainerStyle={{ borderRadius: "0.75rem", overflow: "hidden" }}
          />

          <div className="scanner-overlay">
            <div className="scanner-line"></div>
          </div>

          <motion.div className="absolute top-4 right-4" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
