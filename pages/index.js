import FolderPage from "@/components/folders/folderPage";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";
import { useSession, signIn } from "next-auth/react"
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";


export default function Home() {
  const { data: session, status } = useSession();
  const [folders, setFolders] = useState([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    document.title = "FlashCards";
    
    if (status === "authenticated") {
      fetch("/api/folders").then(res => res.json())
        .then(data => {
        setFolders(data.folders);
        setCompleted(true)
      }).catch(err => console.error(err));
    }
  }, [status])

  if (!session && status === 'unauthenticated') {
    return (
      <div className='flex h-screen'>
        <div className='m-auto'>
          <div onClick={() => signIn()} className='cursor-pointer bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
            Sign In With Google
          </div>
        </div>
    </div>
    )
  }

  return (
    <SnackbarProvider preventDuplicate>
      {status === "authenticated" && completed ? (
        <>
          <Toolbar />
          <FolderPage folders={folders} />
        </>
      ) : <Spinner />}
    </SnackbarProvider> 
  )
}