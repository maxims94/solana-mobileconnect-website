import { NextApiRequest, NextApiResponse } from 'next'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js'
import { GuestIdentityDriver, keypairIdentity, Metaplex } from "@metaplex-foundation/js"

import base58 from "bs58"

type InputData = {
  minterAddress: string,
  nftKey: string
}

const NFT_DATA: { [index: string]: any } = {
  'solana': {
    name: 'Solana',
    mintAddress: 'a',
    metadataUrl: 'a'
  }
}

const COLLECTION_ADDRESS = 'a'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }
  
  try {
  
    if(!process.env.ALCHEMY_API_KEY) {
      throw new Error("Alchemy API Key not found")
    }
    
    if(!process.env.COLLECTION_AUTHORITY_PRIVATE_KEY || !process.env.NFT_AUTHORITY_PRIVATE_KEY) {
      throw new Error("Missing key")
    }
  
    const { minterAddress, nftKey } = req.body as InputData
    
    if(!(nftKey in NFT_DATA)) {
      throw new Error("NFT key not found")
    }
    
    const minterPublicKey = new PublicKey(minterAddress)

    const mintAddress = new PublicKey(NFT_DATA[nftKey].name)

    const endpoint = 'https://solana-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY
      
    const connection = new Connection(endpoint, 'confirmed')
    
    // Get number of nfts already created
    // TODO

    const mintNumber = 1

    // Create a transaction to mint a new NFT
    
    const nfts = Metaplex
      .make(connection)
      .nfts()
    
    const minterIdentity = new GuestIdentityDriver(minterPublicKey)
    
    const nftName = NFT_DATA[nftKey].name + " #" + mintNumber

    const mintKeypair = Keypair.generate()

    const collectionAuthorityKeypair = Keypair.fromSecretKey(base58.decode(process.env.COLLECTION_AUTHORITY_PRIVATE_KEY))

    const nftAuthorityKeypair = Keypair.fromSecretKey(base58.decode(process.env.NFT_AUTHORITY_PRIVATE_KEY))

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

    // Convert to Transaction
    const latestBlockhash = await connection.getLatestBlockhash()
    const transaction = transactionBuilder.toTransaction(latestBlockhash)

    transaction.sign(collectionAuthorityKeypair, mintKeypair)

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false
    }) 
    const base64Transaction = serializedTransaction.toString('base64')

    return res.status(200).json({ transaction: base64Transaction })    
    
  } catch (error:any) {
    return res.status(500).json({ message: String(error) })    
  }
}

/*

async function main() {

  const collectionAuthorityKeypair = Keypair.fromSecretKey(base58.decode(COLLECTION_AUTHORITY_PRIVATE_KEY))

  const nftAuthorityKeypair = Keypair.fromSecretKey(base58.decode(NFT_AUTHORITY_PRIVATE_KEY))

  const payerKeypair = Keypair.fromSecretKey(base58.decode(PAYER_PRIVATE_KEY))

  const tokenOwnerPublicKey = new PublicKey(TOKEN_OWNER_PUBLIC_KEY)

  const connection = new Connection(CLUSTER_URL)

  console.log("Create NFT:", NFT_NAME)

  const mintKeypair = Keypair.generate()

  console.log("Mint address:", mintKeypair.publicKey.toString())

  const transactionBuilder = await nfts.builders().create({
    uri: METADATA_URL,
    name: NFT_NAME,
    symbol: NFT_SYMBOL,
    tokenOwner: tokenOwnerPublicKey,
    updateAuthority: nftAuthorityKeypair,
    mintAuthority: nftAuthorityKeypair,
    sellerFeeBasisPoints: SELLER_FEE_BASIS_POINTS,
    useNewMint: mintKeypair,
    isMutable: IS_MUTABLE,
    collection: collectionPublicKey,
    collectionAuthority: collectionAuthorityKeypair,
    primarySaleHappened: PRIMARY_SALE_HAPPENED
  })

  transactionBuilder.setFeePayer(payerKeypair)

  // Convert to Transaction
  const latestBlockhash = await connection.getLatestBlockhash()
  const transaction = transactionBuilder.toTransaction(latestBlockhash)
  
  /*
  for(const signer of transactionBuilder.getSigners()) {
    if(signer instanceof Keypair) {
      console.log(signer.publicKey)
    } else {
      console.log(signer)
    }
  }

  transaction.sign(collectionAuthorityKeypair, mintKeypair)

  // Show transaction
  /*
  console.log("Transaction:")
  const util = require('util')
  console.log(util.inspect((transaction as any).toJSON(), {depth:null}))

  console.log("Send transaction...")
  const sig = await connection.sendTransaction(transaction, [payerKeypair, collectionAuthorityKeypair, mintKeypair])

}
*/