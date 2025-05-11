"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/components/wallet-provider"
import { TokenService } from "@/lib/token-service"
import { useToast } from "@/components/ui/use-toast"
import { QRScanner } from "@/components/qr-scanner"
import { Loader2, Ticket, ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"

type ScanStep = "scan" | "processing" | "success" | "error"

export default function ScanPage() {
  const { connected, publicKey, connectWallet } = useWallet()
  const [step, setStep] = useState<ScanStep>("scan")
  const [claimError, setClaimError] = useState<string | null>(null)
  const [claimedToken, setClaimedToken] = useState<any>(null)
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

  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto max-w-md py-12 px-4">
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>Please connect your wallet to scan and claim tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={connectWallet} className="w-full">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto max-w-md py-12 px-4">
          {step === "scan" && (
            <>
              <div className="flex items-center mb-6">
                <Button asChild variant="ghost" size="icon" className="mr-2">
                  <Link href="/dashboard">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold">Scan QR Code</h1>
              </div>

              <Card>
                <CardContent className="p-6">
                  <QRScanner onScan={handleScan} onClose={() => window.history.back()} />
                </CardContent>
              </Card>
            </>
          )}

          {step === "processing" && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Claim</CardTitle>
                <CardDescription>Please wait while we process your token claim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-center text-muted-foreground">Verifying token data and processing your claim...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "success" && claimedToken && (
            <Card>
              <CardHeader>
                <CardTitle>Token Claimed!</CardTitle>
                <CardDescription>You have successfully claimed your proof-of-participation token</CardDescription>
              </CardHeader>
              <CardContent>
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

                  <div className="flex gap-4">
                    <Button asChild variant="outline">
                      <Link href="/scan">Scan Another</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/dashboard">View My Tokens</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "error" && (
            <Card>
              <CardHeader>
                <CardTitle>Claim Failed</CardTitle>
                <CardDescription>There was an error claiming your token</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-600 dark:text-red-300" />
                  </div>

                  <p className="text-center text-muted-foreground mb-6">
                    {claimError || "An unknown error occurred while claiming your token."}
                  </p>

                  <div className="flex gap-4">
                    <Button asChild variant="outline">
                      <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                    <Button onClick={() => setStep("scan")}>Try Again</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
