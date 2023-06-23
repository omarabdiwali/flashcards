import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import Spinner from "@/components/spinner";
import CardPage from "@/components/public/cardPage";
import Toolbar from "@/components/toolbar";

export default function Page() {
  const router = useRouter();
  const [approved, setApproved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [folder, setFolder] = useState();
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.id[0].length === 10) {
      fetch("/api/public/access", {
        method: "POST",
        body: JSON.stringify({ code: router.query.id })
      }).then(res => res.json()).then(data => {
        setAnswer(data.answer);

        if (data.answer === "Folder is public.") {
          setFolder(data.folder);
          setApproved(true);
          setCompleted(true);
          let title = data.folder.folder.replace(/ /g, "+");
          window.history.replaceState({}, "Title", `/public/${router.query.id[0]}/${title}`);
        } else {
          setCompleted(true);
        }
      }).catch(err => console.error(err));
    }
    
    else {
      setAnswer("Can't find a folder with this ID.");
      setCompleted(true);
    }
  }, [router.isReady])

  if (!completed) {
    return (
      <>
        <Head>
          <title>FlashCards</title>
        </Head>

        <div className='flex h-screen'>
          <div className="m-auto">
            <Spinner />
          </div>
        </div>
      </>
    )
  }

  if (completed && !approved && answer.length > 0) {
    return (
      <>
        <Head>
          <title>FlashCards</title>
        </Head>

        <Toolbar />

        <div className='flex h-screen'>
          <div className="m-auto">
          <div className="text-2xl">{answer}</div>
          </div>
        </div>
      </>
    )
  }


  return (
    <>
      <Head>
        <title>{folder.folder} | FlashCards</title>
      </Head>

      <Toolbar />

      <div className="flex h-screen">
        <div className="w-full">
          <CardPage title={folder.folder} id={folder.id} email={folder.email} cards={folder.cards} creator={folder.user} date={folder.date.toString().substring(0, 10)} />
        </div>
      </div>
    </>
  )
}