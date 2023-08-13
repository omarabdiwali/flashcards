import { useEffect, useState } from "react"
import Card from "./card";
import Spinner from "../spinner";
import { useSession } from "next-auth/react";

export default function CardPage({ id }) {
  const [cards, setCards] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [access, setAccess] = useState(false);
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");

  const { data: _, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    fetch("/api/cards", {
      method: "POST",
      body: JSON.stringify({ id: id })
    }).then(res => res.json()).then(data => {
      
      setAccess(data.access);
      setCards(data.cards);
      setName(data.name);
      setDate(data.date);
      setUser(data.user);

      setCompleted(true);
    }).catch(err => console.error(err));
  }, [id, status])

  return (
    <>
      {completed ? (
        <>
          <div className="flex text-xl font-bold m-5">
            <div className="flex-1">{name} / By: {user}</div>
            <div>Created on: {date.toString().substring(0, 10)}</div>
          </div>
          <div className="flex h-screen">
            <div className="w-full">
              <Card cards={cards} access={access} id={id} />
            </div>
          </div>
        </>
      ) : <Spinner />}
    </>
  )
}