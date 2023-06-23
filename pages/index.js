import FolderPage from "@/components/folders/folderPage";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";
import Head from "next/head";
import { useSession } from "next-auth/react"
import { SnackbarProvider } from "notistack";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let removeSpaces = search.replace(/ /g, "");
    if (removeSpaces.length === 0) return;

    let searchValue = encodeURIComponent(search.trim());
    window.location.href = `/search/${searchValue}`;
  }

  if (!session && status === 'unauthenticated') {
    return (
      <>
        <Head>
          <title>FlashCards</title>
        </Head>
        <Toolbar />

        <center>
          <form onSubmit={handleSubmit}>
            <input value={search} onChange={handleChange} type="text" className="w-9/12 h-8 border border-2 focus:outline-none px-2 py-5 border-slate-700 bg-black rounded-lg" />
          </form>
        </center>
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
          <center>
            <form onSubmit={handleSubmit}>
              <input value={search} onChange={handleChange} type="text" className="w-9/12 h-8 border border-2 focus:outline-none px-4 py-5 border-slate-700 bg-black rounded-2xl" />
            </form>
          </center>
          
          <FolderPage />
        </>
      ) : <Spinner />}
    </SnackbarProvider> 
  )
}