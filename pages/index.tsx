import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Logo from '@/public/logo.svg'
import HeaderPhone from '@/public/header-phone.svg'
import Waves from '@/public/waves.svg'
import BorderPart from '@/public/border-part.svg'

import PhantomIcon from '@/public/phantom.png'
import GlowIcon from '@/public/glow.png'
import SolflareIcon from '@/public/solflare.png'
import SolanaPayIcon from '@/public/solana-pay.png'

import Star from '@/public/star.svg'

import ActionStars from '@/public/action-stars.svg'

import AboutIcon from '@/public/about-icon.svg'

import Waves2 from '@/public/waves2.svg'

import GithubIcon from '@/public/github.svg'
import TwitterIcon from '@/public/twitter.svg'
import EmailIcon from '@/public/email.svg'

export default function Home() {
  return (
    <>
      <Head>
        <title>Solana MobileConnect</title>
      </Head>
      <main>
        <div className="flex flex-col justify-between h-screen min-h-[800px]">

          <div className="flex flex-row self-center w-3/4 max-w-screen-xl justify-between items-center my-[75px]">

              <Image src={Logo} alt="Solana MobileConnect" />
              <div className="hidden md:block" >
                <a className="underline decoration-4 mr-10 decoration-light_yellow" href="#demo">demo</a>
                <a className="underline decoration-4 decoration-light_pink" href="#about">about</a>
              </div>
          </div>

          <div className="flex flex-col pt-[75px] mb-[75px] relative">

            <div className="absolute h-[374px] mt-[-75px] w-[calc(min(100vw-(100vw-1280px)/2,87.5%))]">
                <Image src={Waves} className="object-cover" alt="" fill />
            </div>

            <Image src={HeaderPhone} alt="Phone with QR code" className="absolute top-[-20px] right-[calc(max((100vw-1280px)/2,12.5%)-150px)]"/>

            <div className="flex flex-row self-center w-3/4 max-w-screen-xl justify-between items-center my-10">

              <div className="flex flex-col">
                <div className="pt-10 pl-10 pr-7 pb-7 relative">
                  <Image src={BorderPart} alt="" className="absolute top-0 left-0"/>
                  <Image src={BorderPart} alt="" className="absolute bottom-0 right-0 rotate-180"/>
                  <h1 className="text-6xl leading-normal font-bold">Use your mobile wallet.<br /><span className="italic">Everywhere.</span></h1>
                </div>
                <p className="text-2xl text-text_gray max-w-xl mt-10">MobileConnect allows you to connect your mobile wallet to a dApp that runs on a different device — for example, your desktop computer.</p>
              </div>
            </div>

          </div>

        </div>
        <div className="flex flex-row justify-center py-8 border-y border-light_gray text-text_gray text-xl">
          <div className="flex flex-row justify-between flex-nowrap items-center  w-3/4 max-w-screen-xl">
            <div className="flex flex-row flex-start items-center">
              <p className="mr-8">Supported wallets:</p>
              <Image src={PhantomIcon} alt="Phantom" className="mr-4"/>
              <Image src={GlowIcon} alt="Glow" className="mr-4"/>
              <Image src={SolflareIcon} alt="Solflare" />
            </div>
            <div className="flex flex-row items-center">
              <p className="mr-4">Powered by</p>
              <Image src={SolanaPayIcon} alt="Solana Pay" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-[100px]">
          <h1 className="text-5xl leading-normal font-bold mb-[75px] underline decoration-4 decoration-light_yellow">Experience the freedom of wallet integration!</h1>
          <div className="flex flex-row text-2xl text-black">
            <div className="flex flex-col mr-[50px]">
              <p className="flex flex-row mb-[50px] items-center"><Image src={Star} alt="" className="mr-10"/>Keys stay in your mobile wallet</p> 
              <p className="flex flex-row items-center"><Image src={Star} alt="" className="mr-10"/>Higher security</p> 
            </div>
            <div className="flex flex-col">
              <p className="flex flex-row mb-[50px] items-center"><Image src={Star} alt="" className="mr-10"/>No browser extensions</p> 
              <p className="flex flex-row items-center"><Image src={Star} alt="" className="mr-10"/>Greater convenience</p> 
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-[100px] bg-gradient-to-b from-[#FF51CA] to-[#FF508F] pt-[100px] pb-[85px]">
          <div className="flex flex-col items-center relative">
            <h1 className="text-white text-6xl mb-[50px]">In Action</h1>
            <iframe width="420" height="315" src="https://www.youtube.com/embed/HmZKgaHa3Fg?autoplay=1&mute=1"></iframe> 
            <Link href="/nft-demo" className="mt-[50px]" target="_blank">
              <div className="flex flex-row justify-center items-center text-white w-[120px] h-[50px] bg-gradient-to-t from-[#FF9900] to-[#FFB800] rounded-full text-[24px] drop-shadow-[3px_4px_0_#FF0099] hover:from-[#FF8A00] hover:to-[#FFB800]">
                Start
              </div>
            </Link>
            <Image src={ActionStars} alt="" className="absolute top-0 right-[-200px]"/>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-[#ddd] to-white w-full h-[150px]">
          </div>
          <div className="flex flex-row items-center mb-[50px]">
            <h1 className="text-[#373737] text-6xl mr-[20px]">About</h1>
            <Image src={AboutIcon} alt="" />
          </div>
          <div className="text-lg w-3/4 max-w-screen-xl">
            <section className="mb-[40px]">
              <h2 className="text-[#FF007A] font-bold text-2xl mb-[25px]">What is the goal?</h2>
              <p className="font-bold">Users should always have the option to use their mobile wallet -- no matter where the target dApp is running.</p>
            </section>

            <section className="mb-[40px]">
              <h2 className="text-[#FF007A] font-bold text-2xl mb-[25px]">How does it work?</h2>
              <p className="mb-[10px] font-bold">MobileConnect consists of two components: Solana Pay and a server in the background.</p>
              <p className="mb-[10px]">Solana Pay is a firmly established technology that allows users to make transactions via QR code.</p>
              <p className="mb-[10px]">The server is used to temporarily store the transactions that a dApps wants to send. They are retrieved by scanning the QR code.</p>
              <p className="mb-[10px] font-bold">The advantage of this approach: users don&#39;t need to install anything to use MobileConnect -- they can just use their existing mobile wallets!</p>
              <p className="mb-[10px]">More details <a href="#" className="underline">here</a>.</p>
            </section>

            <section className="mb-[40px]">
              <h2 className="text-[#FF007A] font-bold text-2xl mb-[25px]">How to add it to my dApp?</h2>
              <p className="mb-[10px]">Install the <a href="#" className="underline">mobileconnect-wallet-adapter</a> package and add it as wallet adapter.</p>
              <p className="mb-[10px] italic">That’s it.</p>
              <p className="mb-[10px]">More details <a href="#" className="underline">here</a>.</p>
            </section>

            <section className="mb-[40px]">
              <h2 className="text-[#FF007A] font-bold text-2xl mb-[25px]">Where can I find the code?</h2>
              <p className="mb-[10px]"><a href="#" className="underline">Overview</a></p>
              <p className="mb-[10px]"><a href="#" className="underline">NFT Demo</a></p>
            </section>
          </div>


        </div>


          <div className="relative h-[351px] mt-[-150px] w-full">
              <Image src={Waves2} className="object-cover" alt="" fill />
          </div>

        <div className="flex flex-row justify-center text-[#666666] text-xl pt-[50px] pb-[50px]">
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
      </main>
    </>
  )
}
