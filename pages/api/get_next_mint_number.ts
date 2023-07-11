import { NextApiRequest, NextApiResponse } from 'next'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js'

import get_next_mint_number from '@/lib/get_next_mint_number'

import base58 from "bs58"

type InputData = {
  nftKey: string
}

const NFT_DATA: { [index: string]: any } = {
  'solana': {
    name: 'Solana Logo',
    metadataUrl: 'https://arweave.net/bgDoeN-vLvSc7_zqy8f_amuTyqRTaSjBpx6C1EPHjiY'
  },
  'superteamde': {
    name: 'SuperteamDE Logo',
    metadataUrl: 'https://arweave.net/63000QY-dGzZj8WWOAuOstxrOXsuhqRoZIVLLR1M8Mc'
  },
  'superteam': {
    name: 'Superteam Logo',
    metadataUrl: 'https://arweave.net/ycdLvQ9XtEH3AAJwe2huTPCpLEzjLKRAzvVAnBDn9BU'
  },
}

const COLLECTION_ADDRESS = '9k9WSAGoY3zLAaADmZqrTpWmJVtHYcWQqCAfhh8MGdYd'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" })
    return
  }

  try {

    if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
      throw new Error("Alchemy API Key not found")
    }

    const { nftKey } = req.body as InputData

    console.log("Get next mint number for:", nftKey)

    if (!(nftKey in NFT_DATA)) {
      res.status(400).json({ message: "Invalid NFT key" })
      return
    }

    const endpoint = 'https://solana-mainnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

    const connection = new Connection(endpoint, 'confirmed')

    const mintNumber = await get_next_mint_number(COLLECTION_ADDRESS, NFT_DATA[nftKey].name, connection)

    console.log("Mint number:", mintNumber)

    res.status(200).json({ mintNumber: mintNumber })

  } catch (error: any) {
    // throw error;
    
    res.status(500).json({ message: String(error) })
  }
}
