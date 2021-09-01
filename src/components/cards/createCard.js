import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, IconButton, Textarea, Text, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useSnackbar } from 'notistack';

export default function CreateCard({ index }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { enqueueSnackbar } = useSnackbar();
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  let handleQues = (e) => {
    let inputValue = e.target.value;
    setQuestion(inputValue);
  }

  let handleAnswer = (e) => {
    let inputValue = e.target.value;
    setAnswer(inputValue);
  }

  function createCard() {
    if (question.length === 0 || answer.length === 0) {
      return;
    }
    const newCard = { index: index, question: question, answer: answer };
    fetch('/create/card', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCard)
    })
    .then(res => res.json())
      .then((data) => {
      if (data.response === "Created card.") {
        enqueueSnackbar("Created Card!", { variant: "success", autoHideDuration: 3000 });
        window.location.reload();
      }
      else {
        enqueueSnackbar("Something went wrong!", { variant: "error", autoHideDuration: 3000 });
      }
    })
  }

  return (
    <>
      <IconButton colorScheme="gray" fontSize="20px" icon={<AddIcon />} onClick={onOpen} style={{ float: "right", marginRight: "10%" }} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Card:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8px">Question</Text>
            <Textarea value={question} onChange={handleQues} size="sm" />
            <Text mb="8px" style={{ paddingTop: "3%" }}>Answer</Text>
            <Textarea value={answer} onChange={handleAnswer} size="sm" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={createCard}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}