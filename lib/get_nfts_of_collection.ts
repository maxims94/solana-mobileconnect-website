// Get the mint addresses of all NFTs that are verified members of a Collection NFT
// See https://github.com/metaplex-foundation/get-collection/blob/main/get-collection-ts/index.ts

import { Connection, Keypair, PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import {
  Metadata,
  PROGRAM_ADDRESS as metaplexProgramId,
} from "@metaplex-foundation/mpl-token-metadata";
    
export default async function get_nfts_of_collection(collectionAddress: string, connection: Connection): Promise<string[]> {

  const metaplex = new Metaplex(connection);

  const collectionPublicKey = new PublicKey(collectionAddress)

  console.log("Getting signatures...");
  let allSignatures: ConfirmedSignatureInfo[] = [];

  // This returns the first 1000, so we need to loop through until we run out of signatures to get.
  let signatures = await connection.getSignaturesForAddress(collectionPublicKey);
  allSignatures.push(...signatures);
  do {
    let options = {
      before: signatures[signatures.length - 1].signature,
    };
    signatures = await connection.getSignaturesForAddress(
      collectionPublicKey,
      options
    );
    allSignatures.push(...signatures);
  } while (signatures.length > 0);

  console.log(`Found ${allSignatures.length} signatures`);
  let metadataAddresses: PublicKey[] = [];
  let mintAddresses = new Set<string>();

  console.log("Getting transaction data...");
  const transactions = await connection.getTransactions(allSignatures.map(s => s.signature))

  for (const tx of transactions) {
    if (tx) {
      // console.log(tx.transaction.signatures[0])
      
      let programIds = tx.transaction.message
        .programIds()
        .map((p) => p.toString());
      let accountKeys = tx.transaction.message.accountKeys.map((p) =>
        p.toString()
      );

      // Only look in transactions that call the Metaplex token metadata program
      if (programIds.includes(metaplexProgramId)) {
        // Go through all instructions in a given transaction
        for (const ix of tx!.transaction.message.instructions) {
          // Filter for setAndVerify or verify instructions in the Metaplex token metadata program
          if (
            (ix.data == "K" || // VerifyCollection instruction
              ix.data == "S" || // SetAndVerifyCollection instruction
              ix.data == "X" || // VerifySizedCollectionItem instruction
              ix.data == "Z") && // SetAndVerifySizedCollectionItem instruction
            accountKeys[ix.programIdIndex] == metaplexProgramId
          ) {
            let metadataAddressIndex = ix.accounts[0];
            let metadata_address =
              tx!.transaction.message.accountKeys[metadataAddressIndex];
            metadataAddresses.push(metadata_address);
          }
        }
      }
      
    }
  }

  const promises2 = metadataAddresses.map((a) => connection.getAccountInfo(a));
  const metadataAccounts = await Promise.all(promises2);
  for (const account of metadataAccounts) {
    if (account) {
      let metadata = await Metadata.deserialize(account!.data);
      mintAddresses.add(metadata[0].mint.toBase58());
    }
  }
  let mints: string[] = Array.from(mintAddresses);
  
  console.log(mints)
  
  return mints
}