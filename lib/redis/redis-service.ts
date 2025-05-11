import { Redis } from "@upstash/redis"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// Event data type
export interface EventData {
  id: string
  name: string
  description: string
  imageUri: string
  merkleRoot: string
  organizerPublicKey: string
  createdAt: number
  attendees: string[]
}

// Token claim data type
export interface TokenClaimData {
  eventId: string
  userPublicKey: string
  claimed: boolean
  claimedAt?: number
}

// Store event data in Redis
export const storeEventData = async (eventData: EventData): Promise<void> => {
  try {
    // Store event data
    await redis.set(`event:${eventData.id}`, JSON.stringify(eventData))

    // Add to organizer's events list
    await redis.sadd(`organizer:${eventData.organizerPublicKey}:events`, eventData.id)

    // Add to all events list
    await redis.zadd("events", { score: eventData.createdAt, member: eventData.id })
  } catch (error) {
    console.error("Error storing event data in Redis:", error)
    throw error
  }
}

// Get event data from Redis
export const getEventData = async (eventId: string): Promise<EventData | null> => {
  try {
    const eventData = await redis.get<string>(`event:${eventId}`)
    return eventData ? JSON.parse(eventData) : null
  } catch (error) {
    console.error("Error getting event data from Redis:", error)
    return null
  }
}

// Get all events for an organizer
export const getOrganizerEvents = async (organizerPublicKey: string): Promise<EventData[]> => {
  try {
    const eventIds = await redis.smembers<string[]>(`organizer:${organizerPublicKey}:events`)

    if (!eventIds || eventIds.length === 0) {
      return []
    }

    const eventPromises = eventIds.map((id) => getEventData(id))
    const events = await Promise.all(eventPromises)

    return events.filter((event) => event !== null) as EventData[]
  } catch (error) {
    console.error("Error getting organizer events from Redis:", error)
    return []
  }
}

// Get recent events
export const getRecentEvents = async (limit = 10): Promise<EventData[]> => {
  try {
    const eventIds = await redis.zrange<string[]>("events", 0, limit - 1, { rev: true })

    if (!eventIds || eventIds.length === 0) {
      return []
    }

    const eventPromises = eventIds.map((id) => getEventData(id))
    const events = await Promise.all(eventPromises)

    return events.filter((event) => event !== null) as EventData[]
  } catch (error) {
    console.error("Error getting recent events from Redis:", error)
    return []
  }
}

// Store token claim data in Redis
export const storeTokenClaimData = async (claimData: TokenClaimData): Promise<void> => {
  try {
    // Store claim data
    await redis.set(`claim:${claimData.eventId}:${claimData.userPublicKey}`, JSON.stringify(claimData))

    // Add to event's claimed tokens list
    if (claimData.claimed) {
      await redis.sadd(`event:${claimData.eventId}:claims`, claimData.userPublicKey)
    }
  } catch (error) {
    console.error("Error storing token claim data in Redis:", error)
    throw error
  }
}

// Get token claim data from Redis
export const getTokenClaimData = async (eventId: string, userPublicKey: string): Promise<TokenClaimData | null> => {
  try {
    const claimData = await redis.get<string>(`claim:${eventId}:${userPublicKey}`)
    return claimData ? JSON.parse(claimData) : null
  } catch (error) {
    console.error("Error getting token claim data from Redis:", error)
    return null
  }
}

// Check if a token has been claimed
export const isTokenClaimed = async (eventId: string, userPublicKey: string): Promise<boolean> => {
  try {
    const claimData = await getTokenClaimData(eventId, userPublicKey)
    return claimData ? claimData.claimed : false
  } catch (error) {
    console.error("Error checking if token is claimed:", error)
    return false
  }
}

// Get all claimed tokens for an event
export const getEventClaims = async (eventId: string): Promise<string[]> => {
  try {
    return (await redis.smembers<string[]>(`event:${eventId}:claims`)) || []
  } catch (error) {
    console.error("Error getting event claims from Redis:", error)
    return []
  }
}
