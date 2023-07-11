import { NextApiRequest, NextApiResponse } from 'next'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js'
import { GuestIdentityDriver, keypairIdentity, guestIdentity, Metaplex } from "@metaplex-foundation/js"

import get_nfts_of_collection from '@/lib/get_nfts_of_collection'
import get_next_mint_number from '@/lib/get_next_mint_number'

import base58 from "bs58"

type InputData = {
  minterAddress: string,
  nftKey: string,
  mintNumber: number
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

    if (!process.env.COLLECTION_AUTHORITY_PRIVATE_KEY || !process.env.NFT_AUTHORITY_PRIVATE_KEY) {
      throw new Error("Missing key")
    }

    const { minterAddress, nftKey, mintNumber } = req.body as InputData

    console.log("Mint NFT:", minterAddress, nftKey)

    if (!(nftKey in NFT_DATA)) {
      res.status(400).json({ message: "Invalid NFT key" })
      return
    }

    if (!minterAddress) {
      res.status(400).json({ message: "Invalid minter address" })
      return
    }

    if (typeof mintNumber !== "number") {
      res.status(400).json({ message: "Invalid mint number" })
      return
    }

    const minterPublicKey = new PublicKey(minterAddress)

    const endpoint = 'https://solana-mainnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

    const connection = new Connection(endpoint, 'confirmed')

    //const mintNumber = await get_next_mint_number(COLLECTION_ADDRESS, NFT_DATA[nftKey].name, connection)

    console.log("Mint number (passed):", mintNumber)

    // Create a transaction to mint a new NFT

    const nfts = Metaplex
      .make(connection)
      .use(guestIdentity(minterPublicKey)) // this ensures that the payer pays the minting costs
      .nfts()

    const minterIdentity = new GuestIdentityDriver(minterPublicKey)

    const nftName = NFT_DATA[nftKey].name + " #" + mintNumber

    const mintKeypair = Keypair.generate()

    const collectionAuthorityKeypair = Keypair.fromSecretKey(base58.decode(process.env.COLLECTION_AUTHORITY_PRIVATE_KEY!))

    const nftAuthorityKeypair = Keypair.fromSecretKey(base58.decode(process.env.NFT_AUTHORITY_PRIVATE_KEY!))

    const collectionPublicKey = new PublicKey(COLLECTION_ADDRESS)

    const transactionBuilder = await nfts.builders().create({
      uri: NFT_DATA[nftKey].metadataUrl,
      name: nftName,
      symbol: "SMC",
      tokenOwner: minterPublicKey,
      updateAuthority: nftAuthorityKeypair,
      mintAuthority: nftAuthorityKeypair,
      sellerFeeBasisPoints: 100,
      useNewMint: mintKeypair,
      isMutable: false,
      collection: collectionPublicKey,
      collectionAuthority: collectionAuthorityKeypair,
      primarySaleHappened: true
    })

    transactionBuilder.setFeePayer(new GuestIdentityDriver(minterPublicKey))

    // Convert to Transaction
    const latestBlockhash = await connection.getLatestBlockhash()
    const transaction = transactionBuilder.toTransaction(latestBlockhash)

    transaction.sign(collectionAuthorityKeypair, mintKeypair)

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false
    })
    const base64Transaction = serializedTransaction.toString('base64')

    console.log(nftName)
    res.status(200).json({ transaction: base64Transaction, nftName, mintAddress: mintKeypair.publicKey.toString() })
    return

  } catch (error: any) {
    // throw error;
    
    res.status(500).json({ message: String(error) })
    return
  }
}
