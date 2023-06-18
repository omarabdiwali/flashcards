import FolderPage from "@/components/folders/folderPage";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react"
import { SnackbarProvider } from "notistack";

export default function Home() {
  const { data: session, status } = useSession();

  if (!session && status === 'unauthenticated') {
    return (
      <>
      <Head>
        <title>FlashCards</title>
      </Head>
      <div className='flex h-screen'>
        <div className='m-auto'>
          <div onClick={() => signIn()} className='cursor-pointer bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
            Sign In With Google
          </div>
        </div>
        </div>
      </>
    )
  }

  return (
    <SnackbarProvider preventDuplicate>
      <Head>
        <title>FlashCards</title>
      </Head>
      {status === "authenticated" ? (
        <>
          <Toolbar />
          <FolderPage />
        </>
      ) : <Spinner />}
    </SnackbarProvider> 
  )
}