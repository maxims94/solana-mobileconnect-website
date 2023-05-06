import { NextApiRequest, NextApiResponse } from 'next'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js'
import { GuestIdentityDriver, keypairIdentity, guestIdentity, Metaplex } from "@metaplex-foundation/js"

import get_nfts_of_collection from '@/lib/get_nfts_of_collection'

import base58 from "bs58"

type InputData = {
  minterAddress: string,
  nftKey: string
}

const NFT_DATA: { [index: string]: any } = {
  'solana': {
    name: 'Solana Logo',
    metadataUrl: 'https://arweave.net/NF_9xgUNDnw6Wjt52u4rMuLl7aJkNJmBGDnWj8XskY0'
  },
  'superteamde': {
    name: 'SuperteamDE Logo',
    metadataUrl: 'https://arweave.net/Y6WY4LMM5LXkhTGBQ_zncvBGAUDn7GrQyQXSMtp9LHg'
  },
  'superteam': {
    name: 'Superteam Logo',
    metadataUrl: 'https://arweave.net/t2UYe2_6s77PUxz21ulJtUF5QoNopdD-91Myw3Cf1BQ'
  },
}

const COLLECTION_ADDRESS = '13EA5cGHYqW6nU9Dx7bSkJX4XYafZybcMEdd4sKznPgQ'

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

    const { minterAddress, nftKey } = req.body as InputData

    console.log("Mint NFT:", minterAddress, nftKey)

    if (!(nftKey in NFT_DATA)) {
      res.status(400).json({ message: "Invalid NFT key" })
      return
    }

    if (!minterAddress) {
      res.status(400).json({ message: "Invalid minter address" })
      return
    }

    const minterPublicKey = new PublicKey(minterAddress)

    const endpoint = 'https://solana-mainnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

    const connection = new Connection(endpoint, 'confirmed')

    const result = await get_nfts_of_collection(COLLECTION_ADDRESS, connection)

    const filteredResult = result.filter(x => x.data.name.startsWith(NFT_DATA[nftKey].name))
    
    const mintNumber = filteredResult.length + 1

    console.log("Mint number:", mintNumber)

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

    res.status(200).json({ transaction: base64Transaction })
    return

  } catch (error: any) {

    res.status(500).json({ message: String(error) })
    return
  }
}
