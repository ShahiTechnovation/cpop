"use client"

import { useState } from "react"
import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { buildMerkleTree, uint8ArrayToHex } from "@/lib/solana/merkle"
import { Loader2 } from "lucide-react"

export function EventCreator() {
  const { connected, publicKey } = useWallet()
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventImage, setEventImage] = useState("")
  const [attendees, setAttendees] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateEvent = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an event",
        variant: "destructive",
      })
      return
    }

    if (!eventName || !eventDescription || !attendees) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // Parse attendees (one per line)
      const attendeeList = attendees.split("\n").filter((a) => a.trim() !== "")

      if (attendeeList.length === 0) {
        throw new Error("Please add at least one attendee")
      }

      // Build Merkle tree
      const { root, proofs } = buildMerkleTree(attendeeList)

      // Convert root to hex string
      const merkleRootHex = uint8ArrayToHex(root)

      // Create event on-chain and store in Redis
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: eventName,
          description: eventDescription,
          imageUri: eventImage,
          merkleRoot: merkleRootHex,
          wallet: {
            publicKey: publicKey,
          },
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create event")
      }

      toast({
        title: "Event created",
        description: `Event "${eventName}" has been created successfully`,
      })

      // Reset form
      setEventName("")
      setEventDescription("")
      setEventImage("")
      setAttendees("")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error creating event",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>Create a new event and generate proof-of-participation tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event-name">Event Name</Label>
          <Input
            id="event-name"
            placeholder="e.g., Solana Hackathon 2023"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-description">Description</Label>
          <Textarea
            id="event-description"
            placeholder="Describe your event"
            rows={3}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-image">Image URL (optional)</Label>
          <Input
            id="event-image"
            placeholder="https://example.com/image.png"
            value={eventImage}
            onChange={(e) => setEventImage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendees">Attendee Wallet Addresses (one per line)</Label>
          <Textarea
            id="attendees"
            placeholder="Enter wallet addresses of attendees, one per line"
            rows={5}
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            These addresses will be eligible to claim tokens for this event
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateEvent} disabled={isCreating || !connected}>
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
