"use client"

import { useState, useEffect } from "react"
import { QrReader } from "react-qr-reader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()

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
        toast({
          title: "QR Code Detected",
          description: "Processing token claim...",
        })
        onScan(data)
      } catch (err) {
        toast({
          title: "Invalid QR Code",
          description: "This QR code doesn't contain valid token data.",
          variant: "destructive",
        })
      }
    }
  }

  const handleError = (err: any) => {
    console.error("QR Scanner error:", err)
    setError("Error accessing camera. Please try again.")
  }

  if (!isMounted) {
    return null // Prevent hydration errors
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
        <CardDescription>Position the QR code within the frame to scan</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : hasPermission === false ? (
          <div className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Camera Access Required</h3>
            <p className="text-muted-foreground mb-4">
              Please allow camera access in your browser settings to scan QR codes.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={handleScan}
              scanDelay={500}
              className="w-full aspect-square"
              videoStyle={{ objectFit: "cover" }}
              videoContainerStyle={{ borderRadius: "0.5rem", overflow: "hidden" }}
            />
            <div className="absolute inset-0 border-[3px] border-dashed border-primary/50 rounded-lg pointer-events-none" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
