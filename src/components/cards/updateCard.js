import React, { useEffect, useState, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Textarea, Text, Button } from '@chakra-ui/react';
import { useSnackbar } from 'notistack';
import './showCards.css';

export default function UpdateCard({ index, cardIndex, card }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { enqueueSnackbar } = useSnackbar();
  const initial = useRef();

  const curQuestion = card[cardIndex].question;
  const curAnswer = card[cardIndex].answer;
  
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();

  useEffect(() => {
    setQuestion(curQuestion);
    setAnswer(curAnswer)
  }, [curQuestion, curAnswer]);

  function updateCard() {
    const removeSpacesQ = question.replace(/ /g, "");
    const removeSpacesA = answer.replace(/ /g, "");
    if (removeSpacesQ.length !== 0 && removeSpacesA.length !== 0) {
      let cardQuestion = card[cardIndex].question;
      let cardAnswer = card[cardIndex].answer;
      if (question.toLowerCase() !== cardQuestion.toLowerCase() || answer.toLowerCase() !== cardAnswer.toLowerCase()) {
        const postMes = { index: index, cardIndex: cardIndex, question: question, answer: answer };
        fetch('/update/card', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(postMes)
        })
        .then(res => res.json())
        .then((data) => {
          if (data.response === "Card has been updated!") {
            enqueueSnackbar("Card has been updated!", { variant: "success", autoHideDuration: 3000 });
            window.location.reload();
          }
          else {
            enqueueSnackbar("Something went wrong.", {variant: "error", autoHideDuration: 3000})
          }
        })
      }
    }
  }

  let handleQues = (e) => {
    let inputValue = e.target.value;
    setQuestion(inputValue);
  }

  let handleAnswer = (e) => {
    let inputValue = e.target.value;
    setAnswer(inputValue);
  }

  return (
    <>
      <button className="random-btn" id="next" onClick={onOpen} style={{ width: "49%", marginLeft: "7px" }}>Edit</button>

      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initial}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Card:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8px">Question</Text>
            <Textarea ref={initial} value={question} onChange={handleQues} size="sm" />
            <Text mb="8px" style={{ paddingTop: "3%" }}>Answer</Text>
            <Textarea value={answer} onChange={handleAnswer} size="sm" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateCard}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}