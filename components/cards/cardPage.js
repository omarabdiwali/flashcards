import { useEffect, useState } from "react"
import Card from "./card";

export default function CardPage({ id }) {
  const [cards, setCards] = useState([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch("/api/cards", {
      method: "POST",
      body: JSON.stringify({ id: id })
    }).then(res => res.json()).then(data => {
      setCards(data.cards.cards);
      setCompleted(true);
    }).catch(err => console.error(err));
  }, [id])

  return (
    <>
      {completed ? (
        <div className="flex h-screen">
          <div className="w-full">
            <Card cards={cards} id={id} />
          </div>
        </div>
      ) : ""}
    </>
  )
}