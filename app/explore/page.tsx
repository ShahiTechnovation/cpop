import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

// Mock data for events
const events = [
  {
    id: "1",
    name: "Solana Hackathon 2023",
    description: "Join the biggest Solana hackathon of the year and build the future of web3.",
    date: "2023-12-01",
    location: "Virtual",
    attendees: 1200,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    name: "DeFi Summit",
    description: "Explore the latest innovations in decentralized finance on Solana.",
    date: "2023-11-15",
    location: "New York, NY",
    attendees: 500,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    name: "NFT Gallery Opening",
    description: "Exclusive gallery opening featuring compressed NFTs on Solana.",
    date: "2023-12-10",
    location: "Los Angeles, CA",
    attendees: 300,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    name: "Web3 Gaming Conference",
    description: "The intersection of gaming and blockchain technology.",
    date: "2024-01-20",
    location: "San Francisco, CA",
    attendees: 800,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function Explore() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Explore Events</h1>
            <Button asChild>
              <Link href="/events">Create Event</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {event.attendees} attendees
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
