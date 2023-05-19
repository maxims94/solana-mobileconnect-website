import { Connection, Keypair, PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import {
  Metadata,
  PROGRAM_ADDRESS as metaplexProgramId,
} from "@metaplex-foundation/mpl-token-metadata";
    
export default async function get_next_mint_number(collectionAddress: string, nftName: string,  connection: Connection): Promise<number> {

  console.log("get_next_mint_number")

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

  for (const { signature: sig } of allSignatures) {
    
    console.log(`Current tx: ${sig}`)

    const tx = await connection.getTransaction(sig)

    if (tx) {
      
      let programIds = tx.transaction.message
        .programIds()
        .map((p) => p.toString());
      let accountKeys = tx.transaction.message.accountKeys.map((p) =>
        p.toString()
      );

      let metadataAddresses: PublicKey[] = [];

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

      let resultSet = new Set<Metadata>();

      const promises2 = metadataAddresses.map((a) => connection.getAccountInfo(a));
      const metadataAccounts = await Promise.all(promises2);
      
      for(let i = 0; i < metadataAccounts.length; i++) {
        const account = metadataAccounts[i]
        
        //console.log(metadataAddresses[i])
        //console.log(account)

        if(account) {
          if(account.lamports == 0) {
            // Skipping non-existing token metadata account (the NFT was probably burned)
            console.log("Skipping zero balance account: ", metadataAddresses[i].toString())
            continue
          }

          let metadata = await Metadata.deserialize(account!.data);
          resultSet.add(metadata[0]);
        }
      }
      
      const result = Array.from(resultSet)
      
      //console.log(result.map(x => [x.data.name, x.mint.toString()]))
      
      if(result.length === 0) {
        continue
      }

      // Assume it has only one element
      
      const metadataAccountName = result[0].data.name
      if (metadataAccountName.startsWith(nftName)) {
        console.log("Found matching NFT name: ", metadataAccountName)
        const currentMintNumber = parseInt(metadataAccountName.split("#")[1])
        return currentMintNumber + 1
      }
      
    }

  }

  // Default mint number
  return 1

}
