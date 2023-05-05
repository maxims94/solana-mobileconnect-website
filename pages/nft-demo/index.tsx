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

import NftDemoInner from '@/components/NftDemoInner'

import { EventEmitter } from 'events';

export default function NftDemo() {
  
  const titleEvent = new EventEmitter()
  
  return (
    <>
      <Head>
        <title>Solana MobileConnect - NFT Demo</title>
      </Head>

      <WalletContextProvider>
      <main>

        <div className="flex flex-col h-screen min-h-[800px]">

          <div className="flex flex-row justify-center pt-[40px] pb-[40px]">
            <div className="flex flex-row justify-between flex-nowrap items-center w-3/4 max-w-screen-xl">
              <div className="flex flex-row items-center cursor-pointer" onClick={() => { titleEvent.emit("titleClick")}}>
                <Image src={NftDemoLogo} alt="" className="mr-[20px]" />
                <h1 className="text-4xl">NFT Demo</h1>
              </div>
              <div><WalletMultiButton /></div>
            </div>
          </div>

          <div className="w-full h-[30px] bg-gradient-to-b from-[#fafafa] to-white border-t border-[#ddd]">
          </div>

          <NftDemoInner titleEvent={titleEvent}/>

          <div className="flex flex-row justify-center text-[#666666] text-xl pt-[50px] pb-[50px] border-t border-[#ddd]">
            <div className="flex flex-row justify-between flex-nowrap items-center w-3/4 max-w-screen-xl">
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
