import FolderPage from "@/components/folders/folderPage";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react"
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState(false);
  const [desc, setDesc] = useState("");

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const animateText = async (value, func) => {
    for (let i = 1; i <= value.length; i++) {
      func(value.substring(0, i));
      await sleep(50);
    }
  }

  useEffect(() => {
    const spell = async () => {
      setTitle("");
      setDesc("");

      let value = "FlashCards - A Way To Store Study Cards";
      await animateText(value, setTitle);

      value = "Have the ability to create folders and flashcards, give access to others to collaborate, be able to view them how you want, and allow them to become public."
      await animateText(value, setDesc);

      setShow(true);
      await sleep(100);
      setPic(true);
    }

    if (status === "unauthenticated") {
      spell().catch(err => console.error(err));
    }
  }, [status])

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
            <input placeholder="Search for folders..." value={search} onChange={handleChange} type="text" className="w-9/12 h-8 border border-2 focus:outline-none px-4 py-5 border-slate-700 bg-black rounded-2xl" />
          </form>
        </center>

        <div className={`min-h-full flex space-x-5`}>
          <div className="flex-1 pl-10 border-none m-auto">
            <div className="mt-2 leading-loose text-blue-700 md:text-5xl sm:text-2xl">
              {title}
            </div>
            <div className="mt-7 leading-tight text-slate-600 md:text-3xl sm:text-xl">{desc}</div>
            <center className={`transition-all duration-400 delay-150 ease-in-out ${show ? "opacity-100" : "opacity-0"}`}>
              <div onClick={() => signIn('google')} className='mt-5 cursor-pointer bg-blue-300 hover:bg-blue-400 text-black font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
                Sign In With Google
              </div>
            </center>
          </div>

          <div className={`flex-1 mx-auto mt-6 transition-all duration-400 delay-300 ease-in-out ${pic ? "opacity-100" : "opacity-0"}`}>
            <center>
              <img src="https://i.imgur.com/g2XnO1L.png" alt="Home Page" className="border mb-5 px-3 py-3 border-2 border-blue-300 rounded-xl w-2/3" />
              <img src="https://i.imgur.com/y57Zucx.png" alt="Cards" className="border px-3 mb-5 py-3 border-2 border-blue-300 rounded-xl w-2/3" />
            </center>
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
          <center>
            <form onSubmit={handleSubmit}>
              <input placeholder="Search for folders..." value={search} onChange={handleChange} type="text" className="w-9/12 h-8 border border-2 focus:outline-none px-4 py-5 border-slate-700 bg-black rounded-2xl" />
            </form>
          </center>
          
          <FolderPage />
        </>
      ) : <Spinner />}
    </SnackbarProvider> 
  )
}