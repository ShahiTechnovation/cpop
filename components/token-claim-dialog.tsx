"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRScanner } from "@/components/qr-scanner"
import { TokenService } from "@/lib/token-service"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/components/ui/use-toast"
import { Check, Loader2, Ticket, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TokenClaimDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (tokenData: any) => void
}

type ClaimStep = "scan" | "manual" | "processing" | "success" | "error"

export function TokenClaimDialog({ open, onOpenChange, onSuccess }: TokenClaimDialogProps) {
  const [step, setStep] = useState<ClaimStep>("scan")
  const [manualCode, setManualCode] = useState("")
  const [scanData, setScanData] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [claimedToken, setClaimedToken] = useState<any>(null)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  const handleScan = async (data: string) => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim tokens",
        variant: "destructive",
      })
      return
    }

    setScanData(data)
    setStep("processing")

    try {
      // Process the token claim
      const result = await TokenService.claimToken(data, { publicKey })

      if (result.success) {
        // Get event details
        const eventDetails = await TokenService.getEventDetails(result.eventId)

        setClaimedToken({
          ...result,
          eventDetails,
        })

        setStep("success")

        if (onSuccess) {
          onSuccess(result)
        }
      } else {
        setClaimError(result.error || "Failed to claim token")
        setStep("error")
      }
    } catch (error) {
      console.error("Error claiming token:", error)
      setClaimError(error instanceof Error ? error.message : "Unknown error occurred")
      setStep("error")
    }
  }

  const handleManualClaim = async () => {
    if (!manualCode.trim()) {
      toast({
        title: "Code required",
        description: "Please enter a claim code",
        variant: "destructive",
      })
      return
    }

    try {
      // Try to parse the manual code as JSON
      const parsedData = JSON.parse(manualCode.trim())
      handleScan(manualCode.trim())
    } catch (error) {
      toast({
        title: "Invalid code format",
        description: "The code you entered is not in a valid format",
        variant: "destructive",
      })
    }
  }

  const resetDialog = () => {
    setStep("scan")
    setScanData(null)
    setClaimError(null)
    setClaimedToken(null)
    setManualCode("")
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after animation completes
    setTimeout(resetDialog, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onCloseAutoFocus={() => resetDialog()}>
        {step === "scan" && (
          <>
            <DialogHeader>
              <DialogTitle>Claim Token</DialogTitle>
              <DialogDescription>Scan a QR code to claim your proof-of-participation token</DialogDescription>
            </DialogHeader>

            <QRScanner onScan={handleScan} onClose={handleClose} />

            <div className="text-center mt-4">
              <Button variant="link" onClick={() => setStep("manual")} className="text-sm">
                Enter code manually instead
              </Button>
            </div>
          </>
        )}

        {step === "manual" && (
          <>
            <DialogHeader>
              <DialogTitle>Enter Claim Code</DialogTitle>
              <DialogDescription>Paste the token claim code below</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="claim-code">Claim Code</Label>
                <Input
                  id="claim-code"
                  placeholder='{"tokenAddress":"...","eventId":"..."}'
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("scan")}>
                  Back to Scanner
                </Button>
                <Button onClick={handleManualClaim}>Verify & Claim</Button>
              </div>
            </div>
          </>
        )}

        {step === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle>Processing Claim</DialogTitle>
              <DialogDescription>Please wait while we process your token claim</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">Verifying token data and processing your claim...</p>
            </div>
          </>
        )}

        {step === "success" && claimedToken && (
          <>
            <DialogHeader>
              <DialogTitle>Token Claimed!</DialogTitle>
              <DialogDescription>You have successfully claimed your proof-of-participation token</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>

              <h3 className="text-xl font-semibold mb-1">{claimedToken.eventDetails?.name || "Event Token"}</h3>

              <p className="text-muted-foreground text-center mb-4">
                {claimedToken.eventDetails?.description || "Proof of participation token"}
              </p>

              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <Ticket className="mr-2 h-4 w-4" />
                <span>Token added to your collection</span>
              </div>

              <Button onClick={handleClose}>View My Tokens</Button>
            </div>
          </>
        )}

        {step === "error" && (
          <>
            <DialogHeader>
              <DialogTitle>Claim Failed</DialogTitle>
              <DialogDescription>There was an error claiming your token</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>

              <p className="text-center text-muted-foreground mb-6">
                {claimError || "An unknown error occurred while claiming your token."}
              </p>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={() => setStep("scan")}>Try Again</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
