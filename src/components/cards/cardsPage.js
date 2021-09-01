import React, { useState, useEffect } from 'react';
import { Heading } from '@chakra-ui/react';
import { useParams, useHistory } from 'react-router-dom';
import CreateCard from './createCard';
import ShowCards from './showCards';

export default function CardsPage() {
  const { folder } = useParams();
  const text = decodeURIComponent(folder);
  const reverse = text.split("").reverse().join("");
  
  const index = folder.substr(folder.indexOf("+") + 1)
  const folderName = text.substring(0, text.length - reverse.indexOf("+") - 1);
  const [cards, setCards] = useState([]);

  const history = useHistory();

  function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  useEffect(() => {
    const card = { index: index };
    fetch('/folder/cards', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(card)
    })
      .then(res => res.json())
      .then((data) => {
        if (data.cards.folder === folderName) {
          let cards = data.cards.cards;
          setCards(shuffle(cards));
        }
        else {
          history.push("/");
        }
    })
  }, [index, folderName, history])

  return (
    <>
      <div style={{margin: "3%"}}>
        <CreateCard index={index} />
      </div>
      {cards.length > 0 ? <ShowCards card={cards} folderIndex={index} /> : <Heading style={{paddingLeft: "30%"}}>No cards are in the folder.</Heading>}
    </>
  )
}