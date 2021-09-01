import React, { useState, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, IconButton, FormControl, FormLabel, Button, Input } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useSnackbar } from 'notistack';

export default function CreateFolder() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");

  const initialRef = useRef();

  let handleName = (e) => {
    let inputValue = e.target.value;
    setName(inputValue);
  }

  async function folderCreation() {
    if (name.length === 0 || name.replace(/ /g, "").length === 0) {
      alert("Folder name cannot be empty / only have spaces.")
    }
    else {
      let folder = { name: name };
      fetch('/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(folder)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data.response);
          if (data.response === `Created '${name}' folder!`) {
            enqueueSnackbar("Folder created!", { variant: "success", autoHideDuration: 3000 });
            window.location.reload();
          }
          else {
            enqueueSnackbar("Something went wrong!", { variant: "error", autoHideDuration: 3000 });
          }
        })
    }
  }

  return (
    <>
      <IconButton colorScheme="gray" fontSize="20px" icon={<AddIcon />} onClick={onOpen} style={{ float: "right" }} />

      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Folder:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Folder name:</FormLabel>
              <Input ref={initialRef} placeholder="Folder name" onChange={handleName} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={folderCreation}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}