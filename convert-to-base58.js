const fs = require("fs");
const bs58 = require("bs58");

// Read the keypair JSON file
const keypairPath = "./mint-keypair.json";
const keypairArray = JSON.parse(fs.readFileSync(keypairPath, "utf8"));

// Ensure it's a Uint8Array
const secretKey = Uint8Array.from(keypairArray);

// Encode the secret key to base58
const base58Secret = bs58.encode(secretKey);

console.log("✅ Base58 Encoded Secret Key:\n");
console.log(base58Secret);
