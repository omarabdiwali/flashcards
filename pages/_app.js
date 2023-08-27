import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SnackbarProvider preventDuplicate>
      <SessionProvider session={session}>
        <Head>
          <meta name="google-site-verification" content="AFBrxKgnj1l1SuZP7euHyl2zmEnTh5kGcTZgsZZ7bMc" />
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </SnackbarProvider>
  )
}
