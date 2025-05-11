import { keccak_256 } from "js-sha3"

// Convert a string to a Uint8Array
export const stringToUint8Array = (str: string): Uint8Array => {
  return new TextEncoder().encode(str)
}

// Convert a hex string to a Uint8Array
export const hexToUint8Array = (hex: string): Uint8Array => {
  if (hex.startsWith("0x")) {
    hex = hex.slice(2)
  }
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

// Convert a Uint8Array to a hex string
export const uint8ArrayToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Hash a leaf for the Merkle tree
export const hashLeaf = (data: string): Uint8Array => {
  const hash = keccak_256.create()
  hash.update(data)
  return new Uint8Array(hash.digest())
}

// Hash two nodes together
export const hashNodes = (left: Uint8Array, right: Uint8Array): Uint8Array => {
  const hash = keccak_256.create()
  hash.update(Buffer.concat([left, right]))
  return new Uint8Array(hash.digest())
}

// Build a Merkle tree from a list of leaves
export const buildMerkleTree = (
  leaves: string[],
): {
  root: Uint8Array
  proofs: Map<string, Uint8Array[]>
} => {
  // Hash all leaves
  const hashedLeaves = leaves.map((leaf) => hashLeaf(leaf))

  // Build the tree
  let level = hashedLeaves
  const tree: Uint8Array[][] = [level]

  // Build the tree bottom-up
  while (level.length > 1) {
    const nextLevel: Uint8Array[] = []

    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        // Hash the pair of nodes
        nextLevel.push(hashNodes(level[i], level[i + 1]))
      } else {
        // If there's an odd number of nodes, promote the last one
        nextLevel.push(level[i])
      }
    }

    level = nextLevel
    tree.push(level)
  }

  // The root is the last node in the tree
  const root = tree[tree.length - 1][0]

  // Generate proofs for each leaf
  const proofs = new Map<string, Uint8Array[]>()

  for (let i = 0; i < hashedLeaves.length; i++) {
    const leaf = hashedLeaves[i]
    const proof: Uint8Array[] = []

    let currentIndex = i

    for (let j = 0; j < tree.length - 1; j++) {
      const level = tree[j]
      const isRight = currentIndex % 2 === 0
      const siblingIndex = isRight ? currentIndex + 1 : currentIndex - 1

      if (siblingIndex < level.length) {
        proof.push(level[siblingIndex])
      }

      currentIndex = Math.floor(currentIndex / 2)
    }

    proofs.set(uint8ArrayToHex(leaf), proof)
  }

  return { root, proofs }
}

// Verify a Merkle proof
export const verifyMerkleProof = (leaf: Uint8Array, proof: Uint8Array[], root: Uint8Array): boolean => {
  let currentHash = leaf

  for (const proofElement of proof) {
    if (uint8ArrayToHex(currentHash) < uint8ArrayToHex(proofElement)) {
      currentHash = hashNodes(currentHash, proofElement)
    } else {
      currentHash = hashNodes(proofElement, currentHash)
    }
  }

  return uint8ArrayToHex(currentHash) === uint8ArrayToHex(root)
}
