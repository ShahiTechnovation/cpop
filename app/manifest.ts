import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "cToken - Proof-of-Participation Platform",
    short_name: "cToken",
    description: "Mint and claim compressed proof-of-participation tokens on Solana",
    start_url: "/",
    display: "standalone",
    background_color: "#13131a",
    theme_color: "#8a2be2",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
