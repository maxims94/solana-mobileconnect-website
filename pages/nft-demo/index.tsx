import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import GithubIcon from '@/public/github.svg'
import TwitterIcon from '@/public/twitter.svg'
import EmailIcon from '@/public/email.svg'

import NftDemoLogo from '@/public/nft-demo-logo.svg'
import MobileConnectIcon from '@/public/mobileconnect-icon.svg'

export default function NftDemo() {
  return (
    <>
      <Head>
        <title>Solana MobileConnect - NFT Demo</title>
      </Head>
      <main>

        <div className="flex flex-col h-screen min-h-[800px]">

          <div className="flex flex-row justify-center pt-[30px] pb-[30px] border">
            <div className="flex flex-row justify-between flex-nowrap items-center w-3/4 max-w-screen-xl border">
              <div className="flex flex-row items-center">
                <Image src={NftDemoLogo} alt="" className="mr-[20px]" />
                <h1 className="text-4xl">NFT Demo</h1>
              </div>
              <div>Connect</div>
            </div>
          </div>

          <div className="w-full h-[30px] bg-gradient-to-b from-[#f3f3f3] to-white border-t-1 border-[#ddd]">
          </div>

          <div className="flex flex-row justify-center pt-[100px] pb-[100px] grow border">
            <div className="flex flex-col items-center w-3/4 max-w-screen-xl border">
              <h1 className="text-4xl mb-[40px]">Step 1</h1>
              <div>
                Connect with “Mobile Wallet”
                <Image src={MobileConnectIcon} className="inline-block ml-[10px]" />
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
    </>
  )
}
