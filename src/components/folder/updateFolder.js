import React, { useState, useRef, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, IconButton, FormControl, FormLabel, Button, Input } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useSnackbar } from 'notistack';

export default function UpdateFolder({ name, index }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { enqueueSnackbar } = useSnackbar();
  
  const [ folder, setFolder ] = useState("");
  const initialRef = useRef();  

  useEffect(() => {
    setFolder(name);
  }, [name]);

  function updateFolder() {
    if (folder !== name) {
      fetch('/update', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({index: index, folder: folder})
      }).then(res => res.json())
      .then((data) => {
        if (data.response === "Folder name has been updated.") {
          enqueueSnackbar("Folder name updated!", { variant: "success", autoHideDuration: 3000 });
          window.location.reload();
        }
        else {
          enqueueSnackbar("Something wrong happened.", { variant: "error", autoHideDuration: 3000 });
        }
      })
    }
  }

  function handleInput(e) {
    setFolder(e.target.value);
  }

  return (
    <>
      <IconButton colorScheme="teal" fontSize="20px" icon={<EditIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Folder:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Folder name:</FormLabel>
              <Input ref={initialRef} value={folder} placeholder="Folder name" onChange={handleInput} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateFolder}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}