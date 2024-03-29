import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import Spinner from "@/components/spinner";
import Toolbar from "@/components/toolbar";
import CardPage from "@/components/cards/cardPage";

export default function Page() {
  const router = useRouter();
  const [approved, setApproved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [name, setName] = useState("");
  const [id, setID] = useState("");
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
          setName(data.name);
          setID(data.id);
          setApproved(true);
          setCompleted(true);
          let title = encodeURIComponent(data.name);
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
        <title>{name} | FlashCards</title>
      </Head>

      <Toolbar />

      <div className="flex h-screen">
        <div className="w-full">
          <CardPage id={id} />
        </div>
      </div>
    </>
  )
}