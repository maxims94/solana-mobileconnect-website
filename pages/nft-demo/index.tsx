import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import GithubIcon from '@/public/github.svg'
import TwitterIcon from '@/public/twitter.svg'
import EmailIcon from '@/public/email.svg'

import NftDemoLogo from '@/public/nft-demo-logo.svg'
import MobileConnectIcon from '@/public/mobileconnect-icon.svg'

import WalletContextProvider from '@/components/WalletContextProvider'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function NftDemo() {
  return (
    <>
      <Head>
        <title>Solana MobileConnect - NFT Demo</title>
      </Head>

      <WalletContextProvider>
      <main>

        <div className="flex flex-col h-screen min-h-[800px]">

          <div className="flex flex-row justify-center pt-[30px] pb-[30px] border">
            <div className="flex flex-row justify-between flex-nowrap items-center w-3/4 max-w-screen-xl border">
              <div className="flex flex-row items-center">
                <Image src={NftDemoLogo} alt="" className="mr-[20px]" />
                <h1 className="text-4xl">NFT Demo</h1>
              </div>
              <div><WalletMultiButton /></div>
            </div>
          </div>

          <div className="w-full h-[30px] bg-gradient-to-b from-[#f3f3f3] to-white border-t-1 border-[#ddd]">
          </div>

          <div className="flex flex-row justify-center pt-[100px] pb-[100px] grow border">
            <div className="flex flex-col items-center w-3/4 max-w-screen-xl border">
              <h1 className="text-4xl mb-[40px]">Step 1</h1>
              <div>
                Connect with “Mobile Wallet”
                <Image src={MobileConnectIcon} className="inline-block ml-[10px]" alt="MobileConnect icon" />
              </div>
            </div>
          </div>


          <div className="flex flex-row justify-center text-[#666666] text-xl pt-[50px] pb-[50px] border">
            <div className="flex flex-row justify-between flex-nowrap items-center w-3/4 max-w-screen-xl border">
              <div>© Solana MobileConnect</div>
              <div className="flex flex-row">
                <Link href="#" target="_blank" className="mr-[20px]">
                  <Image src={GithubIcon} alt="Github" />
                </Link>
                <Link href="#" target="_blank" className="mr-[20px]">
                  <Image src={TwitterIcon} alt="Twitter" />
                </Link>
                <Link href="#" target="_blank">
                  <Image src={EmailIcon} alt="Email" />
                </Link>
              </div>
            </div>
          </div>
        
        </div>

      </main>
      </WalletContextProvider>
    </>
  )
}


/*
  const [txSig, setTxSig] = useState('');
  const [balanceStatus, setBalanceStatus] = useState("unknown");
  const isTransacting = useRef<boolean>(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();

  const onConnect = useCallback(async (publicKey: PublicKey) => {
    console.log("Connected:", publicKey.toString())

    try {

      setBalanceStatus("loading...")
      const balance = await connection.getBalance(publicKey)

      if (balance >= 1 * LAMPORTS_PER_SOL) {

        setBalanceStatus((balance / LAMPORTS_PER_SOL) + " SOL")

      } else {
        isTransacting.current = true;

        setBalanceStatus("airdrop...")

        console.log("Request airdrop of 1 SOL...")
        const signature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);

        console.log("Finalize transaction...")
        await connection.confirmTransaction(signature, "finalized");

        const balance = await connection.getBalance(publicKey)
        setBalanceStatus((balance / LAMPORTS_PER_SOL) + " SOL")
        
        isTransacting.current = false;
        
        console.log("Finalized")
      }
    } catch (error: any) {
      console.error(error)
      setBalanceStatus("error")
    }
  }, [connection, setBalanceStatus])

  const onDisconnect = useCallback(() => {
    console.log("Wallet disconnected")
    setBalanceStatus("unknown")
    setTxSig('')
  }, [setTxSig])

  useEffect(() => {

    if (wallet !== null) {
      wallet.adapter.on('connect', onConnect)
      wallet.adapter.on('disconnect', onDisconnect)

      return () => {
        wallet.adapter.off('connect', onConnect)
        wallet.adapter.off('disconnect', onDisconnect)

      }
    }

  }, [onConnect, onDisconnect, wallet])

  const sendSol = useCallback((event: any) => {

    event.preventDefault()

    if (!connection || !publicKey) {
      alert("Please connect your wallet")
      return
    }

    if (isTransacting.current) {
      alert("Please wait for the previous transaction to complete")
      return
    }

    setTxSig('');
    isTransacting.current = true;

    (
      async () => {
        const receiver = event.target.receiver.value
        const amount = event.target.amount.value

        const tx = new Transaction()

        const senderPubKey = publicKey
        const receiverPubKey = new PublicKey(receiver)

        tx.add(
          SystemProgram.transfer({
            fromPubkey: senderPubKey,
            toPubkey: receiverPubKey,
            lamports: LAMPORTS_PER_SOL * Number(amount)
          })
        )

        tx.add(
          new TransactionInstruction({
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
            keys: [],
            data: Buffer.from(uuid(), 'utf-8')
          })
        )

        tx.feePayer = senderPubKey

        try {

          const latestBlockhash = await connection.getLatestBlockhash()
          tx.recentBlockhash = latestBlockhash.blockhash

          const sig = await sendTransaction(tx, connection)

          console.log("transaction signature: ", sig)
          setTxSig(sig)

          setBalanceStatus("loading...")
          console.log("Finalize transaction...")
          await connection.confirmTransaction(sig, "finalized")

          console.log("Finalized")

          const balance = await connection.getBalance(publicKey)

          console.log("New balance:", balance / LAMPORTS_PER_SOL)

          setBalanceStatus((balance / LAMPORTS_PER_SOL) + " SOL")

        } catch (error: any) {
          console.error(error)
        } finally {
          isTransacting.current = false;
        }

      }
    )().catch(console.error)

  }, [setTxSig, connection, publicKey, sendTransaction])
*/
