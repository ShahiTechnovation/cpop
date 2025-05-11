"use client"

import { useState } from "react"
import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { PublicKey } from "@solana/web3.js"

export function TokenClaimer() {
  const { connected, publicKey } = useWallet()
  const [eventId, setEventId] = useState("")
  const [proofString, setProofString] = useState("")
  const [leafString, setLeafString] = useState("")
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleClaimToken = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim a token",
        variant: "destructive",
      })
      return
    }

    if (!eventId || !proofString || !leafString) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsClaiming(true)
    setClaimStatus("idle")

    try {
      // Validate event ID is a valid PublicKey
      try {
        new PublicKey(eventId)
      } catch (e) {
        throw new Error("Invalid event ID format")
      }

      // Parse proof (comma-separated hex strings)
      const proofHexArray = proofString.split(",").map((p) => p.trim())

      // Claim token on-chain
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          proof: proofHexArray,
          leaf: leafString,
          wallet: {
            publicKey: publicKey,
          },
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to claim token")
      }

      setClaimStatus("success")
      toast({
        title: "Token claimed",
        description: "You have successfully claimed your token",
      })
    } catch (error) {
      console.error("Error claiming token:", error)
      setClaimStatus("error")
      toast({
        title: "Error claiming token",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Token</CardTitle>
        <CardDescription>Claim your proof-of-participation token</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="event-id" className="text-sm font-medium">
            Event ID
          </label>
          <Input
            id="event-id"
            placeholder="Enter the event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="proof" className="text-sm font-medium">
            Merkle Proof (comma-separated hex strings)
          </label>
          <Input
            id="proof"
            placeholder="e.g., 0x1234...,0x5678..."
            value={proofString}
            onChange={(e) => setProofString(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="leaf" className="text-sm font-medium">
            Leaf (hex string)
          </label>
          <Input
            id="leaf"
            placeholder="e.g., 0xabcd..."
            value={leafString}
            onChange={(e) => setLeafString(e.target.value)}
          />
        </div>

        {claimStatus === "success" && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md flex items-center text-green-700 dark:text-green-300">
            <Check className="h-5 w-5 mr-2" />
            <span>Token claimed successfully!</span>
          </div>
        )}

        {claimStatus === "error" && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md flex items-center text-red-700 dark:text-red-300">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to claim token. Please check your inputs and try again.</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleClaimToken} disabled={isClaiming || !connected}>
          {isClaiming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            "Claim Token"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
