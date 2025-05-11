"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientCard } from "@/components/ui/gradient-card"
import { QRCode } from "@/components/qr-code"
import { useWallet } from "@/components/wallet-provider"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, QrCode, Ticket } from "lucide-react"
import Link from "next/link"
import { TokenClaimDialog } from "@/components/token-claim-dialog"

export type TokenMetadata = {
  name: string
  symbol: string
  description: string
  image: string
}

export class TokenService {
  static async getUserTokens(publicKey: string): Promise<TokenMetadata[]> {
    // Mock implementation
    return [
      {
        name: "Sample Token",
        symbol: "STKN",
        description: "A sample token for demonstration",
        image: "https://example.com/sample.png",
      },
    ]
  }

  static async mintToken(
    owner: string,
    recipient: string,
    metadata: TokenMetadata
  ): Promise<{ success: boolean; tokenAddress?: string; error?: string }> {
    // Mock implementation
    return { success: true, tokenAddress: "sampleTokenAddress" }
  }

  static generateQRData(tokenAddress: string, eventId: string, ownerAddress: string): string {
    // Mock implementation
    return `https://example.com/claim?token=${tokenAddress}&event=${eventId}&owner=${ownerAddress}`
  }
}

export default function Dashboard() {
  const { connected, publicKey, connectWallet, username, setUsername, signMessage } = useWallet()
  const [isRegistering, setIsRegistering] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [activeTab, setActiveTab] = useState("mint")
  const [mintForm, setMintForm] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    description: "",
    image: "",
  })
  const [isMinting, setIsMinting] = useState(false)
  const [mintedToken, setMintedToken] = useState<any>(null)
  const [qrData, setQrData] = useState("")
  const [userTokens, setUserTokens] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scannerOpen, setScannerOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (connected && publicKey) {
      loadUserTokens()
    } else {
      setIsLoading(false)
    }
  }, [connected, publicKey])

  const loadUserTokens = async () => {
    setIsLoading(true)
    try {
      const tokens = await TokenService.getUserTokens(publicKey!)
      setUserTokens(tokens)
    } catch (error) {
      console.error("Error loading tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterUsername = async () => {
    if (!connected) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!newUsername) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)
    try {
      // Sign message to verify ownership
      const message = `Register username: ${newUsername}`
      const signature = await signMessage(message)

      if (!signature) {
        throw new Error("Failed to sign message")
      }

      // Update username in context
      setUsername(newUsername)

      toast({
        title: "Username registered",
        description: `You are now known as ${newUsername}`,
      })
    } catch (error) {
      console.error("Error registering username:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleMintToken = async () => {
  if (!publicKey || !connected) {
    toast({
      title: "Not connected",
      description: "Please connect your wallet first",
      variant: "destructive",
    })
    return
  }

  if (!mintForm.name || !mintForm.symbol || !mintForm.description || !mintForm.image) {
    toast({
      title: "Validation Error",
      description: "Please fill in all required fields",
      variant: "destructive",
    })
    return
  }

  setIsMinting(true)
  try {
    const result = await TokenService.mintToken(publicKey, publicKey, mintForm)
    if (!result.success) throw new Error(result.error)

    const tokenAddress = result.tokenAddress
    const eventId = "event_" + Math.random().toString(36).substring(2, 10)
    const ownerAddress = publicKey.toBase58()
    const qr = TokenService.generateQRData(tokenAddress, eventId, ownerAddress)

    setQrData(qr)
    setMintedToken({ tokenAddress, metadata: mintForm, eventId })

    toast({
      title: "Success",
      description: "Token minted successfully",
      variant: "default",
    })
  } catch (error) {
    console.error("Mint error:", error)
    toast({
      title: "Minting failed",
      description: "An error occurred while minting the token",
      variant: "destructive",
    })
  } finally {
    setIsMinting(false)
  }
}


  const handleTokenClaimed = (tokenData: any) => {
    // Refresh the user's tokens after a successful claim
    loadUserTokens()
  }

  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto max-w-6xl py-20 px-4">
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>Please connect your Solana wallet to access the dashboard</CardDescription>
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
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your on-chain identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <div className="flex items-center mt-1.5 p-2 bg-secondary rounded-md text-sm font-mono">
                      {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-6)}
                    </div>
                  </div>

                  {username ? (
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="flex items-center mt-1.5 p-2 bg-secondary rounded-md">{username}</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="new-username">Register Username</Label>
                      <Input
                        id="new-username"
                        placeholder="Enter username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                      <Button onClick={handleRegisterUsername} disabled={isRegistering} className="w-full">
                        {isRegistering ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Quick Links</h3>
                    <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/my-tokens">
                          <Ticket className="mr-2 h-4 w-4" />
                          My Tokens
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/events">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Event
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="mint" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mint">Mint Tokens</TabsTrigger>
                  <TabsTrigger value="claim">Claim Tokens</TabsTrigger>
                </TabsList>

                <TabsContent value="mint" className="space-y-4">
                  <GradientCard>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold mb-2">Mint Experience Tokens</h2>
                      <p className="text-white/80">Create compressed tokens for your events that attendees can claim</p>
                    </div>
                  </GradientCard>

                  {mintedToken ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Token Minted Successfully</CardTitle>
                        <CardDescription>Share this QR code with attendees to claim their tokens</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg mb-4">
                          <QRCode data={qrData} size={200} />
                        </div>
                        <div className="text-center mb-4">
                          <h3 className="font-semibold">{mintedToken.metadata.name}</h3>
                          <p className="text-sm text-muted-foreground">{mintedToken.metadata.description}</p>
                        </div>
                        <div className="flex gap-4">
                          <Button variant="outline" onClick={() => setMintedToken(null)}>
                            Mint Another
                          </Button>
                          <Button>Download QR</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Create New Token</CardTitle>
                        <CardDescription>Fill in the details for your experience token</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="token-name">Token Name</Label>
                              <Input
                                id="token-name"
                                placeholder="e.g., Solana Hackathon 2023"
                                value={mintForm.name}
                                onChange={(e) => setMintForm({ ...mintForm, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="token-symbol">Token Symbol</Label>
                              <Input
                                id="token-symbol"
                                placeholder="e.g., HACK23"
                                value={mintForm.symbol}
                                onChange={(e) => setMintForm({ ...mintForm, symbol: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="token-description">Description</Label>
                            <Input
                              id="token-description"
                              placeholder="Describe your event or experience"
                              value={mintForm.description}
                              onChange={(e) => setMintForm({ ...mintForm, description: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="token-image">Image URL</Label>
                            <Input
                              id="token-image"
                              placeholder="https://example.com/image.png"
                              value={mintForm.image}
                              onChange={(e) => setMintForm({ ...mintForm, image: e.target.value })}
                            />
                          </div>

                          <Button onClick={handleMintToken} disabled={isMinting} className="w-full">
                            {isMinting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Minting...
                              </>
                            ) : (
                              "Mint Token"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="claim" className="space-y-4">
                  <GradientCard>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold mb-2">Claim cToken</h2>
                      <p className="text-white/80">Scan a QR code to claim your proof-of-participation token</p>
                    </div>
                  </GradientCard>

                  <Card>
                    <CardHeader>
                      <CardTitle>Scan QR Code</CardTitle>
                      <CardDescription>Use your camera to scan a token QR code</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <Button className="mb-4" onClick={() => setScannerOpen(true)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        Open Scanner
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">Or paste a token claim code below</p>
                      <div className="w-full mt-4 space-y-4">
                        <Input placeholder="Paste claim code here" />
                        <Button className="w-full" onClick={() => setScannerOpen(true)}>
                          Verify & Claim
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* My Tokens Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">My Tokens</h2>
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userTokens.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userTokens.map((token, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <Ticket className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{token.metadata.name}</h3>
                              <p className="text-sm text-muted-foreground">{token.metadata.symbol}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You don't have any tokens yet</p>
                      <Button asChild variant="outline">
                        <Link href="/explore">Explore Events</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* QR Scanner Dialog */}
      <TokenClaimDialog open={scannerOpen} onOpenChange={setScannerOpen} onSuccess={handleTokenClaimed} />
    </div>
  )
}
