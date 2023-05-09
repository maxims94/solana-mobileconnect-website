import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import GithubIcon from '@/public/github.svg'
import TwitterIcon from '@/public/twitter.svg'
import EmailIcon from '@/public/email.svg'

import NftDemoLogo from '@/public/nft-demo-logo.svg'

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
        <link rel="shortcut icon" href="/nft-demo-logo.svg" />
      </Head>

      <WalletContextProvider>
      <main>

        <div className="flex flex-col h-screen min-h-[800px]">

          <div className="flex flex-row justify-center pt-[40px] pb-[40px]">
            <div className="flex flex-row justify-between flex-nowrap items-center w-3/4 max-w-screen-xl">
              <div className="flex flex-row items-center cursor-pointer" onClick={() => { titleEvent.emit("titleClick")}}>
                <Image src={NftDemoLogo} alt="" className="mr-[20px]" />
                <h1 className="text-4xl font-monda font-bold">NFT Demo</h1>
              </div>
              <div><WalletMultiButton /></div>
            </div>
          </div>

          <div className="w-full min-h-[40px] h-[40px] bg-gradient-to-b from-[#f5f5f5] to-white border-t border-[#ddd]">
          </div>

          <NftDemoInner titleEvent={titleEvent}/>
          
          <div>
            <div className="flex flex-row justify-center mb-[25px] font-archivo font-bold text-[#666] tracking-wide text-lg">
              <a href="/#demo" className="py-3 px-4 border-2 border-[#F0ABDD] mr-[25px] rounded-[10px] hover:text-[#444]" target="_blank">Demo video</a>
              <a href="/" className="py-3 px-4 border-2 border-[#FFE600] rounded-[10px] hover:text-[#444]" target="_blank">Learn more</a>
            </div>

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
        
        </div>

      </main>
      </WalletContextProvider>
    </>
  )
}
