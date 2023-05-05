import Image from 'next/image'
import MobileConnectIcon from '@/public/mobileconnect-icon.svg'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useCallback, useEffect, useState, useRef } from 'react'

import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react';

const MIN_BALANCE = 0.001

const REQUIRED_WALLET_NAME = "Solflare"

import { EventEmitter } from 'events';

export default function NftDemoInner({ titleEvent }: { titleEvent: EventEmitter }) {

  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceStatus, setBalanceStatus] = useState("unknown");
  
  const isTransacting = useRef<boolean>(false);

  const onTitleClick = async () => {
    await wallet?.adapter.disconnect()
  }
  
  const onConnect = useCallback(async (publicKey: PublicKey) => {
    console.log("Connected:", publicKey.toString())
    
    // don't need to check isTransacting here since this will always be the first to run after connecting
  
    try {
      
      isTransacting.current = true;

      setBalanceStatus("loading...")

      const result = await connection.getBalance(publicKey)

      setBalance(result/LAMPORTS_PER_SOL)
      setBalanceStatus(result/LAMPORTS_PER_SOL + " SOL")

      isTransacting.current = false;

    } catch (error: any) {

      console.error(error)
      setBalanceStatus("error")

      isTransacting.current = false;
    }
  }, [connection])

  const onDisconnect = useCallback(() => {
    console.log("Wallet disconnected")
    setBalanceStatus("unknown")
    setBalance(null)
    //setTxSig('')
  }, [])

  useEffect(() => {
    
    titleEvent.removeAllListeners()
    titleEvent.on('titleClick', onTitleClick)

    if (wallet !== null) {
      wallet.adapter.on('connect', onConnect)
      wallet.adapter.on('disconnect', onDisconnect)

      return () => {
        wallet.adapter.off('connect', onConnect)
        wallet.adapter.off('disconnect', onDisconnect)
      }
    }

  }, [onConnect, onDisconnect, wallet])

  const mintNft = useCallback(async (key: string) => {
    
    if(isTransacting.current) {
      alert("Please wait for the previous transaction to complete")
      return
    }
    
    isTransacting.current = true;

    console.log("Mint NFT...", key)
    
    try {
      const result = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nftKey: key, mintAddress: publicKey })
      })

      const resultParsed = await result.json()
      
      console.log(resultParsed)
      
      //sendTransaction()
      /*
      
  console.log("Confirm transaction...")
  const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash()
  const result = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature: sig}, "finalized")
  
  if(result.value.err === null) {
    console.log("Transaction confirmed")
  } else {
    console.log("Transaction failed: ", result.value.err)
  }
  */
    } catch(error: any) {
      console.error(error)
    } finally {
      isTransacting.current = false;
    }

  }, [])
  
  if(publicKey === null) {
    return (
      <div className="flex flex-row justify-center pt-[100px] pb-[100px] grow">
        <div className="flex flex-col items-center w-3/4 max-w-screen-xl">
          <h1 className="text-4xl mb-[40px]">Step 1</h1>
          <div className="text-3xl">
            Connect your wallet using “<Image src={MobileConnectIcon} className="inline-block" alt="MobileConnect icon" /> Mobile Wallet”
          </div>
        </div>
      </div>
    )
  } else {
    
    const output = []

    const walletName = (wallet as Wallet).adapter.name

    if(walletName != REQUIRED_WALLET_NAME) {
      output.push(
        <p key="wrong_wallet">You are using <b>{walletName}</b>. Please use the <b>{REQUIRED_WALLET_NAME}</b> wallet.</p>
      )
    } else {
    
      const publicKeyString = publicKey.toString()
      const publicKeyShort = publicKeyString.substring(0, 4) + "..." + publicKeyString.substring(publicKeyString.length-4);
      
      output.push(
        <p key="logged_in">Logged in as <b>{publicKeyShort}</b>!</p>,
        <p key="balance">Your balance: <b>{balanceStatus}</b></p>
      )
      
      console.log("Wallet name:", walletName)
      
      if(balance !== null) {
        if(balance < MIN_BALANCE) {
          output.push(
            <p key="insufficient_balance">Insufficient balance. Need to have at least {MIN_BALANCE} SOL.</p>
          )        
        } else {
          output.push(
            <p key="minting_cost">Minting costs about 0.001 SOL.</p>,
            <p key="select">Select an NFT:</p>,
            <div key="nft_row" className="flex flex-row">
              <div className="p-4 border rounded mr-4 cursor-pointer" onClick={() => mintNft('solana')}>
                Solana
              </div>
              <div className="p-4 border rounded mr-4 cursor-pointer" onClick={() => mintNft('superteam')}>
                Superteam
              </div>
              <div className="p-4 border rounded cursor-pointer" onClick={() => mintNft('superteam_de')}>
                Superteam DE
              </div>
            </div>
          )
        }
      }
    }
    
    return (
      <div className="flex flex-row justify-center pt-[100px] pb-[100px] grow">
        <div className="flex flex-col items-center w-3/4 max-w-screen-xl">
          <h1 className="text-4xl mb-[40px]">Step 2</h1>
          <div className="text-3xl">
          {
             output 
          }
          </div>
        </div>
      </div>
    )

  }
}
