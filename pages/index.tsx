import Head from 'next/head'
import Image from 'next/image'

import Logo from '@/public/logo.svg'
import HeaderPhone from '@/public/header-phone.svg'
import Waves from '@/public/waves.svg'
import BorderPart from '@/public/border-part.svg'

export default function Home() {
  return (
    <>
      <Head>
        <title>Solana MobileConnect</title>
      </Head>
      <main>
        <div className="flex flex-col justify-between h-screen">

          <div className="flex flex-col justify-between self-center my-10 w-3/4 max-w-screen-xl">
            <div className="flex flex-row justify-between items-center">
              <Image src={Logo} alt="Solana MobileConnect" />
              <div className="hidden md:block" >
                <a className="underline decoration-4 mr-10 decoration-light_yellow" href="#demo">demo</a>
                <a className="underline decoration-4 decoration-light_pink" href="#about">about</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col pt-[75px] mb-[150px] relative">

              <div className="absolute h-[374px] mt-[-75px] w-[calc(87.5%-200px)]">
                  <Image src={Waves} className="object-cover" fill />
              </div>
              <Image src={HeaderPhone} alt="Phone with QR code" className="absolute right-[12.5%] top-[-33px]"/>

            <div className="flex flex-col justify-between self-center w-3/4 max-w-screen-xl">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <div className="pt-10 pl-10 pr-7 pb-7 relative">
                    <Image src={BorderPart} alt="" className="absolute top-0 left-0"/>
                    <Image src={BorderPart} alt="" className="absolute bottom-0 right-0 rotate-180"/>
                    <h1 className="text-6xl leading-normal font-bold">Use your mobile wallet.<br /><span className="italic">Everywhere.</span></h1>
                  </div>
                  <p className="text-2xl text-gray-700 max-w-xl mt-10">MobileConnect allows you to connect your mobile wallet to a dApp that runs on a different device — for example, your desktop computer.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
        <div className="flex flex-row px-4 border-y border-light_gray ">
          <div className="flex flex-row flex-start">
            <p className="mr-4">Supported wallets:</p>
            IMG
          </div>
          Powered by Solana Pay
        </div>
        <div className="mt-[100px]">
          Experience
        </div>
      </main>
    </>
  )
}

    /*
              
    */
