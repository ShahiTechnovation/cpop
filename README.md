# 🎟️ cPOP Pass – Compressed Proof-of-Participation on Solana

**cPOP Pass** is a decentralized platform built on **Solana**, leveraging **Light Protocol** to enable event organizers to mint, distribute, and verify **compressed Proof-of-Participation tokens (cTokens)**. Users can claim their participation tokens via QR codes backed by Merkle root verification, ensuring secure and scalable token distribution.

---

## 🌟 Features

- ✅ Mint compressed NFTs (cTokens) using Light Protocol  
- ✅ Claim tokens via QR code & Merkle proof  
- ✅ On-chain identity through wallet-based username registration  
- ✅ Minimal gas cost using Solana Devnet & compression  
- ✅ Dynamic QR code generation and token claiming system  
- ✅ Fully responsive UI with Next.js + Tailwind CSS  
- ✅ Wallet support for Phantom, Backpack, and more  

---

## 🧱 Tech Stack

| Layer         | Tool / Protocol                |
|---------------|-------------------------------|
| Blockchain    | Solana (Devnet)               |
| Compression   | Light Protocol                |
| Smart Contract| Anchor (Rust) + Merkle Proofs |
| Frontend      | Next.js + Tailwind CSS        |
| Wallet        | Solana Wallet Adapter         |
| QR System     | Custom Generator & Scanner    |

---

## 🚀 How It Works

1. **Organizer** registers a username and initializes an event with a **Merkle root** of attendees.
2. **Minting**: Organizer mints **compressed cTokens** using Light Protocol.
3. **Claiming**: Users scan the event QR and verify their Merkle proof.
4. **Ownership**: Successfully claimed tokens are tied to the wallet and shown on the user dashboard.

---

## 🧪 Development Commands

### 📦 Install dependencies:
```bash
npm install
```

### 💻 Run local development:
```bash
npm run dev
```

### 🛠️ Build & deploy smart contract (if modifying Anchor):
```bash
anchor build && anchor deploy
```

---

## 📁 Folder Structure

```
cpop-pass/
│
├── app/                # Frontend routes (mint, claim, profile)
├── components/         # Reusable UI components (QR, Wallet, Header, etc.)
├── lib/solana/         # Solana logic (program.ts, tokenService.ts)
├── programs/cpop/      # Rust-based Anchor smart contract
├── public/             # Static assets
├── styles/             # Tailwind CSS config
└── README.md           # Project documentation
```

---

## 🌐 Solana RPC & Program Info

- RPC Endpoint (Helius Devnet):  
  `https://devnet.helius-rpc.com/?api-key=247e8191-9ef3-4d0f-82f9-cfd98d52182b`

- Program ID:  
  `Br94deSSULwSGwekP5FsuZqYKfWxBajJmz7t7m5kQusz`

---

## 🚀 Deployment

- Smart Contract: Already deployed to Solana Devnet  
- Fully browser-compatible experience for minting & claiming tokens  
