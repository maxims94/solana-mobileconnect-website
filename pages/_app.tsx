import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { IBM_Plex_Sans, Archivo, Monda } from 'next/font/google';

export const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--ibm-plex-sans'
});

export const archivo = Archivo({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--archivo'
});


export const monda = Monda({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--monda'
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${ibmPlexSans.variable} ${archivo.variable} ${monda.variable}`}>
      <Component {...pageProps} />
    </main>
  )
}
