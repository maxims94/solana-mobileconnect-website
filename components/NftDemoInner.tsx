import Image from 'next/image'
import Link from 'next/link';

import MobileConnectIcon from '@/public/mobileconnect-wallet-adapter-icon.svg'

import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { useCallback, useEffect, useState, useRef } from 'react'

import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react';

const MINTING_COST = 0.015

const REQUIRED_WALLET_NAME = "MobileConnect"

import { EventEmitter } from 'events';

import SolanaNft from '@/public/solana.svg'
import SuperteamDeNft from '@/public/superteamde.svg'
import SuperteamNft from '@/public/superteam.svg'

import LinkIcon from '@/public/link-icon.svg'

export default function NftDemoInner({ titleEvent }: { titleEvent: EventEmitter }) {

  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceStatus, setBalanceStatus] = useState("unknown");

  const isTransacting = useRef<boolean>(false);

  const [isGeneratingTx, setIsGeneratingTx] = useState(false);

  const [txSig, setTxSig] = useState<string | null>(null);
  const mintNftKey = useRef<string | null>(null);
  const mintNftName = useRef<string | null>(null);

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

      setBalance(result / LAMPORTS_PER_SOL)
      setBalanceStatus(result / LAMPORTS_PER_SOL + " SOL")

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

  // Can't use useCallback because it uses a closure with publicKey

  const mintNft = async (key: string) => {

    if (isTransacting.current) {
      alert("Please wait for the previous transaction to complete")
      return
    }

    if (publicKey === null) {
      alert("Please connect your wallet")
      return
    }

    isTransacting.current = true;

    console.log("Mint NFT...", key)

    mintNftKey.current = key

    try {

      setIsGeneratingTx(true)

      const result = await fetch('/api/mint_nft', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nftKey: key, minterAddress: publicKey.toString() })
      })

      if (!result.ok) {
        throw new Error("Error status code received")
      }

      setIsGeneratingTx(false)

      const { transaction: serializedTransaction, nftName } = await result.json()
      
      mintNftName.current = nftName
      
      // Testing
      //setTxSig("test")
      //return

      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'))

      console.log("Send transaction")

      const sig = await sendTransaction(transaction, connection)

      setTxSig(sig)

    } catch (error: any) {
      alert(String(error));
      console.error(error)
    } finally {
      isTransacting.current = false;
      setIsGeneratingTx(false)
    }

  }

  if (publicKey === null || wallet === null) {
    return (
      <div className="flex flex-row justify-center pt-[100px] pb-[100px] grow">
        <div className="flex flex-col items-center w-3/4 max-w-screen-xl">
          <h1 className="text-4xl mb-[40px]">Step 1</h1>
          <div className="text-3xl">
            <p>Connect your mobile <b>Solflare</b> or <b>Glow</b> wallet using <Image src={MobileConnectIcon} className="inline-block ml-2" alt="MobileConnect icon" height={40} /> <b>MobileConnect</b></p>
          </div>
        </div>
      </div>
    )
  } else if (txSig === null) {

    const output = []

    const walletName = (wallet as Wallet).adapter.name

    if (walletName != REQUIRED_WALLET_NAME) {
      output.push(
        <p key="wrong_wallet">You are using <b>{walletName}</b>. Please use the <b>{REQUIRED_WALLET_NAME}</b> wallet.</p>
      )
    } else {

      const publicKeyString = publicKey.toString()
      const publicKeyShort = publicKeyString.substring(0, 4) + "..." + publicKeyString.substring(publicKeyString.length - 4);

      output.push(
        <p key="logged_in">Logged in as <b>{publicKeyShort}</b>!</p>,
        <p key="balance">Your balance: <b>{balanceStatus}</b></p>
      )

      console.log("Wallet name:", walletName)

      if (balance !== null) {
        if (balance < MINTING_COST) {
          output.push(
            <p key="insufficient_balance">Insufficient balance. Need to have at least {MINTING_COST} SOL.</p>
          )
        } else {
          output.push(
            <p key="minting_cost">Minting costs about {MINTING_COST} SOL.</p>,
            <p key="select">Select an NFT:</p>,
            <div key="nft_row" className="flex flex-row">
              <div className="p-4 mr-4 cursor-pointer hover:drop-shadow-[0_0_8px_#A8CBFF]" onClick={async () => await mintNft('solana')}>
                <Image src={SolanaNft} alt="Solana" />
              </div>
              <div className="p-4 mr-4 cursor-pointer hover:drop-shadow-[0_0_8px_#FFD4AC]" onClick={async () => await mintNft('superteamde')}>
                <Image src={SuperteamDeNft} alt="SuperteamDE" />
              </div>
              <div className="p-4 mr-4 cursor-pointer hover:drop-shadow-[0_0_8px_#D9A8FF]" onClick={async () => await mintNft('superteam')}>
                <Image src={SuperteamNft} alt="Superteam" />
              </div>
            </div>
          )

          if (isGeneratingTx) {
            output.push(
              <p key="generating_tx">Generating transaction...</p>
            )
          }
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

  } else {

    let nftImage = null

    if (mintNftKey.current === 'solana') {
      nftImage = <Image src={SolanaNft} alt="Solana" />
    } else if (mintNftKey.current === 'superteamde') {
      nftImage = <Image src={SuperteamDeNft} alt="SuperteamDE" />
    } else if (mintNftKey.current === 'superteam') {
      nftImage = <Image src={SuperteamNft} alt="Superteam" />
    }

    return (
      <div className="flex flex-row justify-center pt-[100px] pb-[100px] grow">
        <div className="flex flex-col items-center w-3/4 max-w-screen-xl">
          <h1 className="text-4xl mb-[40px]">Mint successful!</h1>
          <p>You now own:</p>
          <div className="text-3xl relative">
            {nftImage}
            <div className="absolute top-[110px] right-[-60px]">
              <Link href={`https://explorer.solana.com/tx/${txSig}`} target="_blank">
                <Image src={LinkIcon} alt="Explorer" />
              </Link>
            </div>
          </div>
          <h1>{mintNftName.current}</h1>
          <div onClick={() => setTxSig(null)} className="text-3xl cursor-pointer hover:underline">
            Back
          </div>
        </div>
      </div>
    )

  }
}
