"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCreator } from "@/components/event-creator"
import { TokenClaimer } from "@/components/token-claimer"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("create")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <h1 className="text-3xl font-bold mb-8">Event Management</h1>

          <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="create">Create Event</TabsTrigger>
              <TabsTrigger value="claim">Claim Token</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <EventCreator />
            </TabsContent>

            <TabsContent value="claim">
              <TokenClaimer />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
