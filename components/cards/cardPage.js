import { useEffect, useState } from "react"
import Card from "./card";
import Spinner from "../spinner";
import { useSession } from "next-auth/react";
import { SnackbarProvider } from "notistack";

export default function CardPage({ id }) {
  const [cards, setCards] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [access, setAccess] = useState(false);
  const [folder, setFolder] = useState();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    fetch("/api/cards", {
      method: "POST",
      body: JSON.stringify({ id: id })
    }).then(res => res.json()).then(data => {
      if (status === "authenticated") {
        setAccess(data.folder.emails.includes(session.user.email));
      }
      setCards(data.folder.cards);
      setFolder(data.folder);
      setCompleted(true);
    }).catch(err => console.error(err));
  }, [id, status])

  return (
    <SnackbarProvider preventDuplicate>
      {completed ? (
        <>
          <div className="flex text-xl font-bold m-5">
            <div className="flex-1">{folder.folder} / By: {folder.user}</div>
            <div>Created on: {folder.date.toString().substring(0, 10)}</div>
          </div>
          <div className="flex h-screen">
            <div className="w-full">
              <Card cards={cards} access={access} id={id} />
            </div>
          </div>
        </>
      ) : <Spinner />}
    </SnackbarProvider>
  )
}