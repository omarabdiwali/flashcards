import UpdateCard from './updateCard';
import DeleteCard from './deleteCard';
import React, { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import './showCards.css';

export default function ShowCards({ card, folderIndex }) {
  const [clicked, setClicked] = useState(false);
  const [index, setIndex] = useState(0);

  function onClick() {
    setClicked(!clicked);
  }

  function nextQues() {
    if (index === card.length - 1) {
      return;
    }
    else {
      setIndex(index + 1);
      setClicked(false);
    }
  }

  function prevQues() {
    if (index === 0) {
      return;
    }
    else {
      setIndex(index - 1);
      setClicked(false);
    }
  }

  return (
    <div>
      <main className="main">
        <section className="container">
          <article className="review">
            <header style={{ color: "black"}}>
              <center>
                <p stlye={{ color: "black" }}>{index + 1} / {card.length}</p>
              </center>
              <DeleteCard folder={folderIndex} card={index} />
            </header>
            <div style={{ marginBottom: "20px", color: "black", paddingTop: "9%", paddingBottom: "9%" }} id="question">
              <Heading>{!clicked ? card[index].question : card[index].answer}</Heading>
            </div>
            <div className="btn-group">
              <UpdateCard cardIndex={index} index={folderIndex} card={card} />
              <button className="random-btn" id="next" onClick={onClick} style={{ width: "49%", marginLeft: "4px" }}>{clicked ? "Question" : "Answer"}</button>
            </div>
            <div className="btn-group">
              <button className="random-btn" id="next" onClick={prevQues} style={{ width: "49%", marginLeft: "7px" }}>Back</button>
              <button className="random-btn" id="next" onClick={nextQues} style={{ width: "49%", marginLeft: "4px" }}>Next</button>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}